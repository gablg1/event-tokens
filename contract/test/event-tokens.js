const assert = require('assert');
const { expect } = require("chai");
const { time } = require("@openzeppelin/test-helpers");
const { ethers } = require("hardhat");


const hash = (tokenId, n) => {
  return ethers.utils.arrayify(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [tokenId, n])));
}

const SIGNER = 0;
const eventTokenId = 1;
const slot = 2;
const numSlots = 10;
const fractionsPerSlot = 2;
const URI = "https://foo.bar";

describe("EventTokens", () => {
  let et, accounts, signers;

  before(async () => {
    // Deploy contracts
    const etFactory = await ethers.getContractFactory('EventTokens');

    signers = await ethers.getSigners();
    accounts = signers.map(s => s.address);

    et = await etFactory.deploy(accounts[SIGNER]);
    assert.notEqual(et, undefined, "EventTokens contract instance is undefined.");

    expect(await et.totalSupply(eventTokenId)).to.equal(0);
    await et.createToken(eventTokenId, numSlots, fractionsPerSlot, accounts[SIGNER], URI);

    expect(await et.totalSupply(eventTokenId)).to.equal(numSlots * fractionsPerSlot);
  });

  it("Hash works", async () => {
    const [tokenId, n] = [eventTokenId, slot];
    expect(await et.hash(tokenId, n)).to.equal(ethers.utils.hashMessage(hash(tokenId, n)));
  });

  it("Cannot claim token with wrong signature", async () => {
    const [tokenId, n] = [eventTokenId, slot];
    const badSignature = signers[2].signMessage(hash(tokenId, n));
    await expect(et.claimTokenFractions(tokenId, n, badSignature)).to.be.revertedWith('Wrong signature');
  });

  it("Cannot claim token that was not created", async () => {
    const [tokenId, n] = [eventTokenId + 1, slot];
    const correctSignature = signers[SIGNER].signMessage(hash(tokenId, n));
    await expect(et.claimTokenFractions(tokenId, n, correctSignature)).to.be.revertedWith('Wrong signature');
  });

  it("Claims token with correct signature", async () => {
    const [tokenId, n] = [eventTokenId, slot];
    const correctSignature = signers[SIGNER].signMessage(hash(tokenId, n));

    expect(await et.balanceOf(accounts[3], tokenId)).to.equal(0);

    await et.connect(signers[3]).claimTokenFractions(tokenId, n, correctSignature);

    expect(await et.balanceOf(accounts[3], tokenId)).to.equal(fractionsPerSlot);

    await expect(et.claimTokenFractions(tokenId, n, correctSignature)).to.be.revertedWith('No more fractions');
  });

  it("Claims another token with correct signature", async () => {
    const [tokenId, n] = [eventTokenId, slot + 1];
    const correctSignature = signers[SIGNER].signMessage(hash(tokenId, n));

    expect(await et.balanceOf(accounts[4], tokenId)).to.equal(0);

    await et.connect(signers[4]).claimTokenFractions(tokenId, n, correctSignature);

    expect(await et.balanceOf(accounts[4], tokenId)).to.equal(fractionsPerSlot);

    await expect(et.claimTokenFractions(tokenId, n, correctSignature)).to.be.revertedWith('No more fractions');
  });

  it("Total supply works", async () => {
    expect(await et.totalSupply(eventTokenId)).to.equal(numSlots * fractionsPerSlot);
  });

  it("Token URI", async () => {
    expect(await et.uri(eventTokenId)).to.equal(URI)
  });
});
