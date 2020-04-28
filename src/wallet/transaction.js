const { id, verifySignature, hash } = require("../util/chain-helper");
const { MINING_REWARD } = require("../config");

class Transaction {
  constructor() {
    this.id = id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderWallet.amount) {
      console.log(`Amount: ${amount} exceeds balance.`)
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;

  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      throw Error(`Amount: ${amount} exceeds balance!`)
    }
    return Transaction.transactionWithOutputs(senderWallet, [
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient }
    ]);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey
      }
    ])
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timeStamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(hash(transaction.outputs))
    }
  }

  static verifyTransaction(transaction) {
    return verifySignature(
      transaction.input.address,
      transaction.input.signature,
      hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;