const Block = require("./block")

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()]
  }

  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
    return block;
  }

  isValid(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    const isHashIncorrected = (block) => block.hash !== Block.blockHash(block);
    const isPrevHashIncorrected = (block, prevBlock) => block.lastHash !== prevBlock.hash;
    for (let i = 1; i < chain.length; i++) {
      if (isHashIncorrected(chain[i]) || isPrevHashIncorrected(chain[i], chain[i - 1])) {
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer than the current chain!");
      return;
    }
    if (!this.isValid(newChain)) {
      console.log("Received chain is not valid!");
      return
    };

    console.log("Replacing blockchain with new chain");
    this.chain = newChain;
  }
}

module.exports = BlockChain;