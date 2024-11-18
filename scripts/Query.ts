import { getContract, hexToString } from "viem";
import { deployerClient } from "./client";
import { abi as ballotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // get Ballot contract instance
    const BALLOT_ADDRESS = process.env.BALLOT_ADDRESS_KAI;
    if (!BALLOT_ADDRESS) {
        throw new Error("Ballot address not found in environment");
    }
    const ballotContract = getContract({
        address: BALLOT_ADDRESS as `0x${string}`,
        abi: ballotAbi,
        client: deployerClient
    });

    // get winner number and name
    const winner = await ballotContract.read.winningProposal();
    const winnerName = await ballotContract.read.winnerName() as `0x${string}`;
    console.log(`The winner is proposal ${winner} with name ${hexToString(winnerName)}`);
}

main().catch((err) => {
    console.error(err);
});