import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { createPublicClient, http, createWalletClient } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

dotenvConfig({ path: resolve(__dirname, "../.env") });

export const providerApiKey = process.env.ALCHEMY_API_KEY || "";
export const deployerPrivateKey = process.env.PRIVATE_KEY || "";

const proposals = process.argv.slice(2);
//if (!proposals || proposals.length < 1)
//  throw new Error("Proposals not provided");

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});


export const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
export const deployerClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

/*export const providerApiKey = process.env.ALCHEMY_API_KEY || "";
export const ALCHEMY_URL = process.env.ALCHEMY_URL || "";
export const deployerPrivateKey = process.env.PRIVATE_KEY || "";
// Remove the '0x' prefix if it exists, then add it back to ensure consistent formatting
const privateKey = deployerPrivateKey.startsWith('0x') ? deployerPrivateKey : `0x${deployerPrivateKey}`;

// Create shared client instances
export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`${ALCHEMY_URL}${providerApiKey}`),
});

// Create deployer account
export const deployer = privateKeyToAccount(privateKey as `0x${string}`);
export const deployerClient = createWalletClient({
    account: deployer,
    chain: sepolia,
    transport: http(`${ALCHEMY_URL}${providerApiKey}`),
});*/