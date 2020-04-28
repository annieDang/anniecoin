const TransactionPool = require("../wallet/transaction-pool");
// const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
const BlockChain = require("../models/blockchain");

describe('TransactionPool', () => {
  let tp, wallet, transaction, blockChain;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    blockChain = new BlockChain();
    transaction = wallet.createTransaction("random-address", 30, blockChain, tp);
  });

  it('adds a transaction to the pool', () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, "new-whatever", 40);
    tp.updateOrAddTransaction(newTransaction);
    expect(tp.transactions.find(t => t.id === newTransaction.id)).not.toEqual(oldTransaction);
  });

  it("clears transactions", () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe("mixing valid and corrupt transaction pool", () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction("random-address", 30, blockChain, tp);
        if (i % 2 === 0) {
          transaction.input.amount = 1234;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('shows a difference between valid and corrupt transaction', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('grabs valid transaction', () => {
      expect(tp.validTransactions()).toEqual(validTransactions);
    });
  });

});