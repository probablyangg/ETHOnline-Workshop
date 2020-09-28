const Web3 = require("web3");
const { getTypedData } = require("./meta-tx")
const request = require('request')
const maticProvider = "https://rpc-mumbai.matic.today";
// const goerliProvider = "https://goerli.infura.io/v3/f3ffe28620114fd2bd00c5a3ebe55558";
const token = {
  // "5": "0x5232FcD6C08C9B4B16efc2F62e2CD3f7FF59d4A9",
  "80001": "0x2395d740789d8C27C139C62d1aF786c77c9a1Ef1",
  "name": "prueba"
}
let mumbai = new Web3(maticProvider), eth, accounts, chain

async function fillMaticDetails () {
  let _data = await mumbai.eth.abi.encodeFunctionCall({
    name: 'balanceOf',
    type: 'function',
    inputs: [{
        type: 'address',
        name: 'address'
    }]
  }, [accounts[0]]);

  let balanceMumbai = await mumbai.eth.call ({
    to: token["80001"],
    data: _data
  });

  document.getElementById("mum-token").innerHTML = token["80001"]
  document.getElementById("mum-balance").innerHTML = parseInt(balanceMumbai)
}

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!')
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    document.getElementById("account").innerHTML = accounts[0]
    chainArea = document.getElementById("chain")
    chain = await window.ethereum.chainId
    chain = parseInt(chain)
    chainArea.innerHTML = chain
    eth = window.ethereum
    await fillMaticDetails ()
  }
})


async function executeMetaTx(functionSig) {
  let data = await mumbai.eth.abi.encodeFunctionCall({
    name: 'getNonce', 
    type: 'function', 
    inputs: [{
        name: "user",
        type: "address"
      }]
  }, [accounts[0]]);
  let _nonce = await mumbai.eth.call ({
    to: token["80001"],
    data
  });
  const dataToSign = getTypedData({
    name: token["name"],
    version: '1',
    salt: '0x0000000000000000000000000000000000000000000000000000000000013881',
    verifyingContract: token["80001"],
    nonce: parseInt(_nonce),
    from: accounts[0],
    functionSignature: functionSig
  });
  const msgParams = [accounts[0], JSON.stringify(dataToSign)];
  let sig = await eth.request ({
    method: 'eth_signTypedData_v3', 
    params: msgParams
  });
  const { r, s, v } = getSignatureParameters(sig);
  return { sig, r, s, v }
}


document.getElementById('transferBtn').onclick = async () => {
  const amt = document.getElementById("setAmount").value
  const to = document.getElementById("setAddress").value
  let data = await mumbai.eth.abi.encodeFunctionCall({
    name: 'transfer', 
    type: 'function', 
    inputs: [
      {
        "name":"recipient",
        "type":"address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ]
  }, [to, amt])
  let { sig, r, s, v } = await executeMetaTx (data)
  document.getElementById('resultFor').innerHTML = `Result from Transfer call`
  document.getElementById('result').innerHTML = 
  `sig:`+sig + `<br />` + `<br />`
  +`function sig:`+data
  let tx = {
    intent: sig, 
    fnSig: data, 
    from: accounts[0], 
    contractAddress: token["80001"]
  }
  await executeAndDisplay (tx, 'executed')
}

async function executeAndDisplay(txObj, el) {
  const response = await request.post(
    'http://localhost:3000/exec', {
      json: txObj,
    },
    (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      document.getElementById(el).innerHTML = 
      `response:`+ JSON.stringify(body)
    }
  )
}

const getSignatureParameters = (signature) => {
  if (!mumbai.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    )
  }
  var r = signature.slice(0, 66)
  var s = "0x".concat(signature.slice(66, 130))
  var v = "0x".concat(signature.slice(130, 132))
  v = mumbai.utils.hexToNumber(v)
  if (![27, 28].includes(v)) v += 27
  return { r, s, v }
}
