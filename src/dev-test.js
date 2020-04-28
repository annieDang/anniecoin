// const BlockChain = require('./models/blockchain');

// bc = new BlockChain();

// for (i = 0; i < 10; i++) {
//   console.log(bc.addBlock(`foo ${i}`).toString());
// }

const Wallet = require("./wallet");

const wallet = new Wallet();

console.log(wallet.toString());