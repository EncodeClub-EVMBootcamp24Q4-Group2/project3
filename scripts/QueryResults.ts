import { createPublicClient, http, parseAbi, formatUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { abi as _ballotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, "../.env") });

const ballotAddress = process.env.MYBALLOT_ADDRESS!;
const providerUrl = process.env.ALCHEMY_URL!;
const providerApiKey = process.env.ALCHEMY_API_KEY!;

if (!providerUrl || !providerApiKey) {
    throw new Error('Please set ALCHEMY_URL and ALCHEMY_API_KEY in your .env file');
}

const client = createPublicClient({
    chain: sepolia,
    transport: http(`${providerUrl}${providerApiKey}`),
});

async function getBallotResults() {
    const ballotContract = {
        address: ballotAddress as `0x${string}`,
        abi: _ballotAbi,
    };

    const proposalNames: string[] = [];
    const proposalVoteCounts: bigint[] = [];
    let i = 0;
    while (true) {
        try {
            const proposal = await client.readContract({
                ...ballotContract,
                functionName: 'proposals',
                args: [i],
            }) as { name: string; voteCount: bigint };

            const proposalName = Buffer.from(proposal.name.slice(2), 'hex').toString().replace(/\0/g, '');
            console.log("Proposal Name: ", proposalName);
            proposalNames.push(proposalName);
            proposalVoteCounts.push(BigInt(proposal.voteCount));
            i++;
        } catch (error) {
            break;
        }
    }

    // console.log(`Number of proposals: ${proposalNames.length}`);

    proposalNames.forEach((name, index) => {
        console.log(`Proposal ${index}: ${name} - Votes: ${proposalVoteCounts[index]}`);
    });

    const winnerName = await client.readContract({
        ...ballotContract,
        functionName: 'winnerName',
    }) as string;

    if (winnerName === "") {
        console.log("All proposals have 0 votes.");
    } else {
        console.log(`Winning Proposal: ${Buffer.from(winnerName.slice(2), 'hex').toString().replace(/\0/g, '')}`);
    }
}

getBallotResults().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});