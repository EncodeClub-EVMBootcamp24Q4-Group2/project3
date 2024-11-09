import { getContract, formatEther, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { publicClient } from "./config";
import { abi as ballotAbi } from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const BALLOT_ADDRESS = process.env.BALLOT_ADDRESS_KAI;

    interface Proposal {
        name: `0x${string}`;
        voteCount: bigint;
    }

    // Get arguments from command line
    const [privateKey, proposalNumber] = process.argv.slice(2);
    if (!privateKey || !proposalNumber) {
        throw new Error(
            "Please provide the private key of the wallet to vote and select the order number of proposal to vote for as an argument.\n"
        );
    }

    // get Ballot contract instance
    if (!BALLOT_ADDRESS) {
        throw new Error("Ballot address not found in environment");
    }
    const ballotContract = getContract({
        address: BALLOT_ADDRESS as `0x${string}`,
        abi: ballotAbi,
        client: publicClient
    });

    // Create wallet client for the token holder
    const account = privateKeyToAccount(`0x${privateKey}`);
    const voteAddress = account.address;

    // Get all proposals
    const proposals = await ballotContract.read.getAllProposals() as Proposal[];
    const proposalIndex = Number(proposalNumber);
    
    // Validate proposal number is within range
    if (proposalIndex >= proposals.length || proposalIndex < 0) {
        throw new Error(`Invalid proposal number. Must be between 0 and ${proposals.length - 1}`);
    }

    // Get proposal details
    const proposal = proposals[proposalIndex];
    console.log(`Proposal ${proposalIndex}: ${hexToString(proposal.name)} has ${formatEther(proposal.voteCount)} votes before your vote`);

    // check if vote power is enough
    const votePower = await ballotContract.read.getVotePower([voteAddress]) as bigint;
    if (votePower <= 0n) {
        throw new Error("You don't have any vote power");
    }

    // vote
    await ballotContract.write.vote(
        [BigInt(proposalIndex), votePower],
        {
            account,
            chain: sepolia
        }
    );
    console.log(`You have voted ${formatEther(votePower)} votes for proposal ${proposalIndex}: ${hexToString(proposal.name)}`);
}

main().catch((err) => {
    console.error(err);
});