import { createPublicClient, createWalletClient, http,  } from 'viem';
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from 'viem/chains';
import { config as dotenvConfig } from "dotenv";
import { resolve } from 'path';

dotenvConfig({ path: resolve(__dirname, "../.env") });

const providerApiKey = process.env.ALCHEMY_API_KEY!;
const providerUrl = process.env.ALCHEMY_URL!;
let deployerPrivateKey = process.env.PRIVATE_KEY!;

// Ensure the required environment variables are set
if (!providerApiKey || !providerUrl || !deployerPrivateKey) {
    throw new Error('Please set ALCHEMY_API_KEY, ALCHEMY_URL, and PRIVATE_KEY in your .env file');
}

// Ensure the PRIVATE_KEY starts with '0x'
if (!deployerPrivateKey.startsWith("0x")) {
    console.warn(
        "⚠️ PRIVATE_KEY does not start with '0x'. Prepending it automatically."
    );
    deployerPrivateKey = `0x${deployerPrivateKey}`;
}


// Create a public client
const client = createPublicClient({
    chain: sepolia,
    transport: http(`${providerUrl}${providerApiKey}`),
});

// Define the deployer account
const deployer = privateKeyToAccount(deployerPrivateKey as `0x${string}`);
const deployerClient = createWalletClient({
    chain: sepolia,
    transport: http(`${providerUrl}${providerApiKey}`),
    account: deployer,
});

export { client, deployer, deployerClient };