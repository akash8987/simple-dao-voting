const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const { dao } = JSON.parse(fs.readFileSync("deployed_addresses.json"));
    const DaoContract = await hre.ethers.getContractAt("VotingDAO", dao);

    const PROPOSAL_ID = 1;

    console.log(`Voting on proposal ${PROPOSAL_ID}...`);
    const tx = await DaoContract.vote(PROPOSAL_ID);
    await tx.wait();
    console.log("Vote cast successfully!");
}

main().catch(console.error);
