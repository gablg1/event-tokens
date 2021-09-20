const assert = require('assert');
const { expect } = require("chai");
const { time } = require("@openzeppelin/test-helpers");
const { ethers } = require("hardhat");


const hash = (tokenId, n) => {
  return ethers.utils.arrayify(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [tokenId, n])));
}

const SIGNER = 0;

describe("EventTokens", () => {
  let et, accounts, signers;

  before(async () => {
    // Deploy contracts
    const etFactory = await ethers.getContractFactory('EventTokens');

    signers = await ethers.getSigners();
    accounts = signers.map(s => s.address);

    et = await etFactory.deploy(accounts[SIGNER]);
    assert.notEqual(et, undefined, "EventTokens contract instance is undefined.");
  });

  it("Hash works", async () => {
    const [tokenId, n] = [1, 2];
    expect(await et.hash(tokenId, n)).to.equal(ethers.utils.hashMessage(hash(tokenId, n)));
  });

  it("Cannot claim token with wrong signature", async () => {
    const [tokenId, n] = [1, 2];
    const badSignature = signers[2].signMessage(hash(tokenId, n));
    await expect(et.claimToken(tokenId, n, badSignature)).to.be.revertedWith('Wrong signature');
  });

  it("Claims token with correct signature", async () => {
    const [tokenId, n] = [1, 2];
    const correctSignature = signers[SIGNER].signMessage(hash(tokenId, n));

    expect(await et.balanceOf(accounts[3], tokenId)).to.equal(0);

    await et.connect(signers[3]).claimToken(tokenId, n, correctSignature);

    expect(await et.balanceOf(accounts[3], tokenId)).to.equal(1);


  });
});
