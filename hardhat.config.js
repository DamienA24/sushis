/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const fs = require("fs");
const privateKey =
  fs.readFileSync(".secret").toString().trim() || "01234567890123456789";
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/i4bMj-Rc7EcL90cTBjDJzzvIlO0Egpxf",
      accounts: [privateKey],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [privateKey],
    },
  },

  etherscan: {
    apiKey: "SWGUR33IS55PM66KUTC5UTKJ9RHVH64FP4",
  },

  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
