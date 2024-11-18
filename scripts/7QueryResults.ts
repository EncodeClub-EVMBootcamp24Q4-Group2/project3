// npx ts-node --files ./scripts/7QueryResults.ts "BallotAddress"

import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address } from "viem";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
    console.log("Get winning vote");

    ///////////////////////////////////////////////////////
    // Creating a public client
    ///////////////////////////////////////////////////////
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    ///////////////////////////////////////////////////////
    // Check if the parameters are provided
    ///////////////////////////////////////////////////////
    const parameters = process.argv.slice(2);
    // Check if sufficient parameters are provided
    if (!parameters || parameters.length < 1)
        throw new Error("Parameters not provided");
    // Check if the contract address is provided
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");

    console.log("Contract address:", contractAddress);

    // Print all of the proposals with their vote count
    console.log("Proposals with Count of Votes:");
    const proposal = parameters[1] as string;
    // Validate that proposal is valid & get index
    var proposalIndex = 0;
    do {
        try {
            const proposals = (await publicClient.readContract({
                address: contractAddress,
                abi,
                functionName: "proposals",
                args: [BigInt(proposalIndex)],
            })) as any[];
            const name = hexToString(proposals[0], { size: 32 });
            const voteCount = proposals[1];
            console.log({ proposalIndex, name, voteCount });
            proposalIndex++;
        } catch (error) {
            // No More proposals
            break;
        }
    } while (proposalIndex < 1000 );

    ////////////////////////////////////////////////////////////
    // Sending transaction on user confirmation
    const winnerName = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "winnerName",
    })) as any;
    console.log("Winner Name:", hexToString(winnerName, { size: 32 }));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});