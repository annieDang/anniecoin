const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool")
const BlockChain = require("../models/blockchain");

describe("Wallet", () => {
  let wallet, tp, blockChain;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    blockChain = new BlockChain();
  });

  describe("creating a transaction", () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = "random-address";
      transaction = wallet.createTransaction(recipient, sendAmount, blockChain, tp);
    });

    describe("and doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, blockChain, tp);
      });

      it("doubles the `send amount` subtracted from the wallet balance", () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - (sendAmount * 2));
      });

      it("clones the `sendAmount` output for the recipient", () => {
        expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount))
          .toEqual([sendAmount, sendAmount]);
      });

    });

    describe("calculating a balance", () => {

    });
  });

});