/**
 * /* hardhat.config.js
 *
 * @format
 */
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //  unused configuration commented out for now
     mumbai: {
       url: "https://rpc-mumbai.maticvigil.com",
       accounts: [process.env.privateKey]
     }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
