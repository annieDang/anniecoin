const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
const { MINING_REWARD } = require("../config");

describe('Transaction', () => {

  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 10;
    recipient = "recipient-address";
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it(`sees sender's wallet after transaction`, () => {
    expect(transaction.outputs.find(output => output.address = wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });

  it(`sees recipient's wallet after transaction`, () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
      .toEqual(amount);
  });

  it(`inputs the balance of the wallet`, () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it(`validates a valid transaction`, () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it(`invalidates a corrupt transaction`, () => {
    transaction.outputs[0].amount = 5000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe("and updating a transaction", () => {
    let nextAmount, nextRecipient;
    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = "test-me";
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it(`subtracts the next amount from the sender's output`, () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
    });

    it(`outputs an amount for the next recipient`, () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
    });
  });

  describe("creating a reward transaction", () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet())
    });

    it("rewarding the miner", () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
    });

  });

});