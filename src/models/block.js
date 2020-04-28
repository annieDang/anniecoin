const { hash } = require("../util/chain-helper")
const { DIFFICULTY, MINE_RATE } = require('../config')
class Block {
  constructor(timestamp, index, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.index = index;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  static hash(index, timestamp, lasthash, data, nonce, difficulty) {
    const blockString = `${index}-${nonce}-${difficulty}-${timestamp}-${JSON.stringify(data)}-${lasthash}`;
    return hash(blockString);
  }

  toString() {
    return (
      `Block: 
        TimeStamp : ${this.timestamp}
        LastHash  : ${this.lastHash.substring(0, 10)}
        Hash      : ${this.hash.substring(0, 10)}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}  
        Data      : ${this.data}  
      `
    )
  }

  static genesis() {
    return new this("Genesis", 0, "___________", "this-is-genesis!", [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    const index = lastBlock.index + 1;
    let timestamp, hash, nonce = 0;
    let { difficulty } = lastBlock;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(index, timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, index, lastHash, hash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    return lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
  }

  static blockHash(block) {
    const { index, timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(index, timestamp, lastHash, data, nonce, difficulty);
  }
}

module.exports = Block;