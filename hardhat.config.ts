import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import key from './key'

const config: HardhatUserConfig = {
  solidity: "0.8.18",

  networks: {
    horizen: {
      url: "https://gobi-testnet.horizenlabs.io/ethv1",
      accounts: [key[0]]
    }
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: key[1],

    customChains: [
      {
        network: "horizen",
        chainId: 1663,
        urls: {
          apiURL: "https://gobi-explorer.horizen.io/api",
          browserURL: "https://gobi-explorer.horizen.io/"
        }
      }
    ]
  }
};

export default config;
