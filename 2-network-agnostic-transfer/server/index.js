const express = require('express')
const app = express()
const cors = require('cors')
const _ = require('lodash')
const Web3 = require('Web3')
const web3 = new Web3 (process.env.RPC)
const morgan = require('morgan')
const PORT = process.env.PORT
app.use(morgan('dev'))

// set contract
const abi = require ('./abi.json').abi
const contract = new web3.eth.Contract(abi)

// set user
const pvtKey = process.env.PRIVATE_KEY
web3.eth.accounts.wallet.add(pvtKey)
const user = web3.eth.accounts.wallet[0].address

const getSignatureParameters = (signature) => {
  if (!web3.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    )
  }
  var r = signature.slice(0, 66)
  var s = "0x".concat(signature.slice(66, 130))
  var v = "0x".concat(signature.slice(130, 132))
  v = web3.utils.hexToNumber(v)
  if (![27, 28].includes(v)) v += 27
  return { r, s, v }
}

app.use(express.json({ extended: true }))
app.use(cors())
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post (
  '/exec', 
  async function (req, res, next) {
  txDetails = _.pick(req.body, [
    'intent', 
    'fnSig',
    'from',
    'contractAddress'
  ])
  const { r, s, v } = getSignatureParameters(txDetails.intent)
  contract.options.address = txDetails.contractAddress
  try {
    let tx = await contract.methods.executeMetaTransaction(
      txDetails.from, txDetails.fnSig, r, s, v
    ).send ({
      from: user,
      gas: 800000
    })
    req.txHash = tx.transactionHash
  } catch (err) {
    console.log (err)
    next(err)
  }
  next()
  },
  (req, res, next) => {
    res.send ({
      result: req.txHash
    })
  }
)

console.log (`listening on Port ${PORT}.`)
app.listen(process.env.PORT)
