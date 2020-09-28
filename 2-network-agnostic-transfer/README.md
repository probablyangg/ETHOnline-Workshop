# Network Agnostic Transactions Demo

based on MetaTx standard by Biconomy: https://github.com/bcnmy/metatx-standard

## Demo

[![Watch the video](https://img.youtube.com/vi/ETvnnZGQDDc/2.jpg)](https://youtu.be/ETvnnZGQDDc)

## Dependencies
```bash
$ npm i
```

## Run simple relayer
> __Note__: Remember to add PRIVATE_KEY in .env file inside `server`

```bash
$ source server/.env
$ node server/index
```

## Compile
> __Note__: Remember to recompile after making changes to sign.js
```
$ browserify sign.js > bundle.js
```

## Run client & interact
```
$ http-server
```
