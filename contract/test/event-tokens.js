const assert = require('assert');
const { time } = require("@openzeppelin/test-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("EventTokens", () => {
  let et, accounts, signers;

  before(async () => {
    // Deploy contracts
    const etFactory = await ethers.getContractFactory('EventTokens');
    et = await etFactory.deploy();
    assert.notEqual(et, undefined, "EventTokens contract instance is undefined.");

    signers = await ethers.getSigners();
    accounts = signers.map(s => s.address);

  });

  it("TODO", async () => {
    assert.notEqual(et.address, undefined, "Contract address must not be undefined.");
  });
});
