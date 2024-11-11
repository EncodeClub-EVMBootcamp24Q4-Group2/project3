import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const alchemyUrl = process.env.ALCHEMY_URL || "";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  // defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: `${alchemyUrl}${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
  },
};

export default config;