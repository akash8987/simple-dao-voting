const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy Token
  const Token = await hre.ethers.getContractFactory("GovernanceToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("Token deployed to:", token.target);

  // 2. Deploy DAO
  const DAO = await hre.ethers.getContractFactory("VotingDAO");
  const dao = await DAO.deploy(token.target);
  await dao.waitForDeployment();
  console.log("DAO deployed to:", dao.target);

  // Save addresses for scripts
  const addresses = { token: token.target, dao: dao.target };
  fs.writeFileSync("deployed_addresses.json", JSON.stringify(addresses));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
