const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const { dao } = JSON.parse(fs.readFileSync("deployed_addresses.json"));
    const DaoContract = await hre.ethers.getContractAt("VotingDAO", dao);

    console.log("Creating proposal...");
    const tx = await DaoContract.createProposal("Hire a new Solidity Dev");
    await tx.wait();
    console.log("Proposal created! ID: 1 (Assuming fresh deploy)");
}

main().catch(console.error);
