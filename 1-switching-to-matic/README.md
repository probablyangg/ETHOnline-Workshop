# ETHOnline Workshop: Build on Matic (Sep 28, 2020)

## Usage

Install dependencies

```bash
$ npm i
```

Compile contracts

```bash
$ truffle compile
```

Start local ganache

```bash
$ ganache-cli
```

Migrate contracts

```bash
$ truffle migrate
```

## Migrate to Matic

Add matic's network object to truffle.js config file

```javascript
  const HDWalletProvider = require("@truffle/hdwallet-provider");
  const mnemonic = process.env.MNEMONIC
  ...
  ...
  ...
  module.exports={
    ...
    ...
    matic: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rpc-mumbai.matic.today");
      },
      network_id: '80001',
    }
    ...
    ...
  }
```

export your mnemonic phrase, account 0 of which will be used to deploy the contracts

```bash
export MNEMONIC='....12 word seed phrase....'
```

Migrate contracts to Matic

```bash
$ truffle migrate --network matic
```

Run frontend

```bash
$ npm run dev
```
