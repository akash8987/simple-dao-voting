const { expect } = require("chai");
const hre = require("hardhat");

describe("VotingDAO", function () {
  let token, dao, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await hre.ethers.getSigners();
    
    // Deploy
    const Token = await hre.ethers.getContractFactory("GovernanceToken");
    token = await Token.deploy();
    const DAO = await hre.ethers.getContractFactory("VotingDAO");
    dao = await DAO.deploy(token.target);

    // Distribute tokens to addr1
    await token.transfer(addr1.address, hre.ethers.parseEther("50"));
  });

  it("Should allow token holders to create proposals", async function () {
    await dao.createProposal("Buy more coffee");
    const p = await dao.proposals(1);
    expect(p.description).to.equal("Buy more coffee");
  });

  it("Should weigh votes by token balance", async function () {
    await dao.createProposal("Test Proposal");
    
    // Owner votes (has ~1M tokens)
    await dao.vote(1);
    
    const p = await dao.proposals(1);
    // Expect vote count to be roughly owner's balance
    expect(p.voteCount).to.be.gt(hre.ethers.parseEther("900000"));
  });

  it("Should fail if user has no tokens", async function () {
    const [_, _, noTokenUser] = await hre.ethers.getSigners();
    await dao.createProposal("Test");
    await expect(
      dao.connect(noTokenUser).vote(1)
    ).to.be.revertedWith("No voting power");
  });
});
