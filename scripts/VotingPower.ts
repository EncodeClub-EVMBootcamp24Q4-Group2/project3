import { createPublicClient, http, parseAbi, formatUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { abi as _Abi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, "../.env") });

const tokenAddress = process.env.MYTOKEN_ADDRESS!;
const providerUrl = process.env.ALCHEMY_URL!;
const providerApiKey = process.env.ALCHEMY_API_KEY!;

if (!providerUrl || !providerApiKey) {
    throw new Error('Please set ALCHEMY_URL and ALCHEMY_API_KEY in your .env file');
}

const client = createPublicClient({
    chain: sepolia,
    transport: http(`${providerUrl}${providerApiKey}`),
});

async function getVotingPower(walletAddress: string) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        throw new Error('Invalid wallet address format');
    }
    
    const tokenContract = {
        address: tokenAddress as `0x${string}`,
        abi: _Abi,
    };

    const votingPower = await client.readContract({
        ...tokenContract,
        functionName: 'getVotes',
        args: [walletAddress],
    }) as bigint;

    console.log(`Voting power of wallet ${walletAddress}: ${formatUnits(votingPower, 18)} MyToken`);
}

const walletAddress = process.argv[2];
if (!walletAddress) {
    throw new Error('Please provide a wallet address as a command-line argument');
}

getVotingPower(walletAddress).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});