import { getContract, hexToString, http, createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

// TODO: add more safeguards and print out the names and options

async function getWinner() {
    // get Ballot contract instance
    const BALLOT_ADDRESS = process.env.ZZ_BALLOT_ADDRESS;
    if (!BALLOT_ADDRESS) {
        throw new Error("Ballot address not found in environment");
    }
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    const ballotContract = getContract({
        address: BALLOT_ADDRESS as `0x${string}`,
        abi,
        client: publicClient
    });

    // get winner number and name
    const winner = await ballotContract.read.winningProposal();
    const winnerName = await ballotContract.read.winnerName() as `0x${string}`;
    console.log(`The winner is proposal ${winner} with name ${hexToString(winnerName)}`);
}

getWinner().catch((err) => {
    console.error(err);
});

// npx ts-node --files scripts/GetWinner.ts