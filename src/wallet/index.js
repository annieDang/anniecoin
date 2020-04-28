const { genKeyPair } = require("../util/chain-helper")
const Transaction = require("./transaction")
const { WALLET_INITIAL_AMOUNT } = require("../config")

class Wallet {
  constructor(initalAmount) {
    this.balance = initalAmount | WALLET_INITIAL_AMOUNT;
    this.keyPair = genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex'); // account address
  }

  toString() {
    return (
      `Wallet
        Balance   : ${this.balance}
        Public key: ${this.publicKey.toString()}
      `
    )
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  calculateBalance(blockchain) {
    const transactions = [];
    let balance = this.balance;

    blockchain.chain.forEach(
      block => block.data.forEach(transaction => transactions.push(transaction))
    );

    const walletTransactionInputs = transactions.filter(
      transaction => transaction.input.address === wallet.publicKey
    );

    let startTime = 0;

    if (walletTransactionInputs.length > 0) {
      const recentInputTransaction = walletTransactionInputs.reduce(
        (prev, next) => prev.input.timeStamp > next.input.timeStamp ? prev : next
      );

      balance = recentInputTransaction.outputs.find(output => output.address === this.publicKey).amount;

      startTime = recentInputTransaction.input.timeStamp;
    }

    transactions.forEach(t => {
      if (t.input.timeStamp > startTime) {
        t.outputs.find(output => output.address === this.publicKey).forEach(
          output => balance += output.amount
        );
      }
    });

    return balance;
  }

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceceds the balance ${this.balance}`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction)
    }

    return transaction;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "blockchain-wallet";
    return blockchainWallet;
  }
}

module.exports = Wallet;