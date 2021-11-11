const fs = require("fs");
const path = require("path");

const DEFAULT_NETWORK = "localhost";

const argValue = (arg, defaultValue) =>
  process.argv.includes(arg)
    ? process.argv[process.argv.indexOf(arg) + 1]
    : typeof defaultValue === "function"
    ? defaultValue()
    : defaultValue;

const network = process.env.HARDHAT_NETWORK || DEFAULT_NETWORK;
const CONTRACTS_PATH = `./${network}-contracts.json`;

const contractsFile = () => path.join(__dirname, CONTRACTS_PATH);

const contractsDeployed = JSON.parse(fs.readFileSync(contractsFile(), "utf8"));

module.exports = {
  CONTRACTS_PATH,
  contractsFile,
  contractsDeployed,
  config: require('./config.json'),
};
