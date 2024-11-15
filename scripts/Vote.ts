import { createWalletClient, http, parseEther, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { abi as _ballotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { client } from './config';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import readline from 'readline';

dotenv.config({ path: resolve(__dirname, "../.env") });

const ballotAddress = process.env.MYBALLOT_ADDRESS!;

if (!ballotAddress) {
    throw new Error('Please set MYBALLOT_ADDRESS in your .env file');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

interface Proposal {
    name: string;
    voteCount: bigint;
}

// Convert bytes32 to string
function bytes32ToString(bytes32: string): string {
    return Buffer.from(bytes32.slice(2), 'hex').toString('utf8').replace(/\0/g, '');
}

async function getProposalNames() {
    const ballotContract = {
        address: ballotAddress,
        abi: _ballotAbi,
    };

    const proposalNames: string[] = [];
    let i = 0;
    while (true) {
        try {
            const proposal = await client.readContract({
                ...ballotContract,
                functionName: 'proposals',
                args: [i],
            }) as Proposal;
            proposalNames.push(bytes32ToString(proposal.name));
            i++;
        } catch (error) {
            break;
        }
    }

    return proposalNames;
}

async function main() {
    const proposalNames = await getProposalNames();
    console.log("Available options:");
    proposalNames.forEach((name, index) => {
        console.log(`[${index}] ${name}`);
    });

    rl.question('Enter your private key: ', (privateKey) => {
        rl.question('Enter the proposal index: ', (proposalIndex) => {
            rl.question('Enter the amount to vote: ', (voteAmount) => {
                vote(privateKey, parseInt(proposalIndex), voteAmount).catch((error) => {
                    console.error(error);
                    process.exitCode = 1;
                }).finally(() => rl.close());
            });
        });
    });
}

async function vote(privateKey: string, proposalIndex: number, voteAmount: string) {
    const voter = privateKeyToAccount(privateKey as `0x${string}`);
    const voterClient = createWalletClient({
        chain: sepolia,
        transport: http(`${process.env.ALCHEMY_URL}${process.env.ALCHEMY_API_KEY}`),
        account: voter,
    });

    const ballotContract = {
        address: ballotAddress,
        abi: _ballotAbi,
    };

    // Check vote power
    const votePower = await client.readContract({
        ...ballotContract,
        functionName: 'getVotePower',
        args: [voter.address],
    }) as bigint;
    if (votePower <= 0n) {
        throw new Error("You don't have any vote power");
    }
    
    console.log(`Your vote power: ${votePower}`);

    const voteTx = await client.writeContract({
        ...ballotContract,
        functionName: 'vote',
        args: [BigInt(proposalIndex), parseEther(voteAmount)],
    });

    console.log("Voting...");
    const receipt = await client.waitForTransactionReceipt({hash: voteTx});
    console.log("Vote transaction hash:", {hash: voteTx});
    console.log("Vote transaction receipt:", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

