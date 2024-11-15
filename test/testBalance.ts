import { createPublicClient, http, formatUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { abi as _Abi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, "../.env") });

const tokenAddress = '0x5064c5eed17f73c3711adef19c87652a2113277f';
const providerUrl = process.env.ALCHEMY_URL!;
const providerApiKey = process.env.ALCHEMY_API_KEY!;

if (!providerUrl || !providerApiKey) {
    throw new Error('Please set ALCHEMY_URL and ALCHEMY_API_KEY in your .env file');
}

const client = createPublicClient({
    chain: sepolia,
    transport: http(`${providerUrl}${providerApiKey}`),
});

async function getBalance(walletAddress: string) {
    const tokenContract = {
        address: tokenAddress as `0x${string}`,
        abi: _Abi,
    };

    const balance = await client.readContract({
        ...tokenContract,
        functionName: 'balanceOf',
        args: [walletAddress],
    }) as bigint;

    console.log(`Balance of wallet ${walletAddress}: ${formatUnits(balance, 18)} MyToken`);
}

const walletAddress = process.argv[2];
if (!walletAddress) {
    throw new Error('Please provide a wallet address as a command-line argument');
}

getBalance(walletAddress).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});