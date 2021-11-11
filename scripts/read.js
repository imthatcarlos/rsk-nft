// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const networkName = hre.network.name
const { contractsFile, contractsDeployed, config } = require("./../utils/migrations");

async function getTokens(account) {
  const WeMint = await hre.ethers.getContractFactory('WeMint');
  const contract = await WeMint.attach(contractsDeployed['WeMint']);
  console.log("WeMint deployed to:", contract.address);

  const balance = await contract.balanceOf(account);
  if (balance.toNumber() === 0) {
    console.log('no tokens owned');
    return;
  }

  const tokenIds = await Promise.all(Array(balance.toNumber()).fill(0).map((_, idx) => contract.tokenOfOwnerByIndex(account, idx)));
  const [name, symbol, tokenURIs] = await Promise.all([
    contract.name(),
    contract.symbol(),
    Promise.all(tokenIds.map((id) => contract.tokenURI(id.toNumber())))
  ]);

  console.log({
    name,
    symbol,
    tokenURIs
  });
};

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [{ address }] = await hre.ethers.getSigners();
  console.log(`account: ${address}`);

  await getTokens(address);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
