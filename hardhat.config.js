require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    local: {
      url: "http://127.0.0.1:8545",  // Local Hardhat network URL
      gas: 21000,  // Set a reasonable gas limit
      gasPrice: 20000000000  // Set the gas price (20 Gwei is a standard amount)
    }
  }
};

