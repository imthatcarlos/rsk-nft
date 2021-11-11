
require("@nomiclabs/hardhat-truffle5");
require('hardhat-deploy');
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();
const fs = require('fs');

const RSK_TESTNET_URL = 'https://public-node.testnet.rsk.co';
const gasPriceTestnetRaw = fs.readFileSync('.gas-price-testnet.json').toString().trim();
const gasPriceTestnet = parseInt(JSON.parse(gasPriceTestnetRaw).result, 16);
if (typeof gasPriceTestnet !== 'number' || isNaN(gasPriceTestnet)) {
  throw new Error('unable to retrieve network gas price from .gas-price-testnet.json');
}
console.log(`gas price testnet (RSK): ${gasPriceTestnet}`);

const settings = {
  optimizer: {
    enabled: true,
    runs: 200
  }
};

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.0',
        settings
      }
    ],
  },
  paths: {
    artifacts: './build'
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ['local']
    },
    rsk_testnet: {
      url: RSK_TESTNET_URL,
      chainId: 31,
      gasPrice: Math.floor(gasPriceTestnet * 1.1),
      timeout: 20000,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/37310'/0'/0/",
        initialIndex: 0,
        count: 1
      }
    },
  }
};
