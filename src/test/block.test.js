const Block = require("../models/block");

describe("Block", () => {
  let data, lastBlock, block;

  beforeEach(() => {
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it("sets the data to match the input", () => {
    expect(block.data).toEqual(data);
  });

  it("sets the last hash to match to match of the last block", () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it("generates a hash that matches the difficulty", () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
  });

  it("lowers the difficulty for slowey mined blocks", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 3600000))
      .toEqual(block.difficulty - 1);
  });

  it("increases the difficulty for fast mined blocks", () => {
    expect(Block.adjustDifficulty(block, block.timestamp))
      .toEqual(block.difficulty + 1);
  });

});