const BlockChain = require("../models/blockchain");
const Block = require("../models/block");

describe("Blockchain", () => {
  let bc;
  let bc2;
  beforeEach(() => {
    bc = new BlockChain();
    bc2 = new BlockChain();
  });

  it("starts with genesis", () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it("add new block", () => {
    const data = "testData";
    bc.addBlock(data);
    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

  it("validates a valid chain", () => {
    bc2.addBlock("fff");
    expect(bc.isValid(bc2.chain)).toBe(true);
  });

  it("invalidates a chain with corrupt genesis block", () => {
    bc2.addBlock("fff");
    bc2.chain[0].data = "dddd";
    expect(bc.isValid(bc2.chain)).toBe(false);
  });

  it("invalidates a chain with corrupt block data", () => {
    bc2.addBlock("fff");
    bc2.chain[1].data = "dddd";
    expect(bc.isValid(bc2.chain)).toBe(false);
  });

  it("replaces the chain with a valid chain", () => {
    bc2.addBlock("relaceBlock");
    bc.replaceChain(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  });

  it("doesnt replace the chain with a invalid chain", () => {
    bc.addBlock("second block"); // bc will have longer chain than bc2 => cannot replace
    bc.replaceChain(bc2.chain);

    expect(bc.chain).not.toEqual(bc2.chain);
  });
});