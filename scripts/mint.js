// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const networkName = hre.network.name
const { contractsFile, contractsDeployed, config } = require("./../utils/migrations");

async function mint(account, { to, URI, royaltyRecipient, royaltyValue }) {
  const WeMint = await hre.ethers.getContractFactory('WeMint');
  const contract = await WeMint.attach(contractsDeployed['WeMint']);
  console.log("WeMint deployed to:", contract.address);
  console.log('mint()');

  try {
    return await contract.mint(to, URI, royaltyRecipient, royaltyValue);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const _config = config[networkName]?.mint;
  console.log(`config: ${JSON.stringify(_config, null, 2)}`);

  const [{ address }] = await hre.ethers.getSigners();
  console.log(`account: ${address}`);

  const params = {
    to: address,
    URI: _config.metadataURI,
    royaltyRecipient: address,
    royaltyValue: 50, // 5 %
  };
  console.log(`params: ${JSON.stringify(params, null, 2)}`);

  const res = await mint(address, params);
  console.log(res);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
