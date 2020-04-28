const express = require("express");
const bodyParser = require("body-parser");
const BlockChain = require("../models/blockchain");
const P2pServer = require('./p2p-server');
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool")
const PORT = process.env.HTTPPORT || 3000;
const Miner = require("./miner");

const app = express();
app.use(bodyParser.json());

const blockChain = new BlockChain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();

const p2pServer = new P2pServer(blockChain, transactionPool);
const miner = new Miner(blockChain, transactionPool, wallet, p2pServer);

app.get("/blocks", (req, res) => {
  res.json(blockChain.chain);
});

app.post("/mine", (req, res) => {
  const { data } = req.body;
  blockChain.addBlock(data);
  res.redirect("/blocks")
  p2pServer.syncChains();
});

app.get("/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, blockChain, transactionPool);
  p2pServer.broadcastTransaction(transaction);
  res.redirect("/transactions");
});

app.get("/public-key", (req, res) => {
  res.json(wallet.publicKey);
});

app.get("/mine-transaction", (req, res) => {
  const block = miner.mine();
  console.log(`${block} was added!`);
  res.redirect("/blocks")
});

app.listen(PORT, () => console.log(`Listenning on port: ${PORT}`));
p2pServer.listen(); 