const fs = require('fs');
const { contractsFile, contractsDeployed, config } = require("./../utils/migrations");

const getArgs = ({ name }) => {
  console.log(`getArgs:: from: ${name}`);
  const _config = config[name]?.WeMint;

  console.log(JSON.stringify(_config, null, 2));

  return Object.keys(_config).map((k) => _config[k]);
};

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // skip deploy on `npx hardhat node`
  if (network.name === 'hardhat') return;

  const { address } = await deploy('WeMint', {
    from: deployer,
    args: getArgs(network),
    log: true,
  });

  contractsDeployed['WeMint'] = address;
  fs.writeFileSync(contractsFile(), JSON.stringify(contractsDeployed, null, 2));
};

module.exports.tags = ['WeMint'];
