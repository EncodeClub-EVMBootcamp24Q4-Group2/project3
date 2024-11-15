import { hexToString } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();
import { publicClient, deployerClient } from "./client";

async function main() {
    console.log("CastVote started with parameters: contract address, proposal index, voter address");

    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
      throw new Error("Parameters not provided");

    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
      throw new Error("Invalid contract address");

    const proposalIndex = parameters[1];
    if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

    const voterAddress = parameters[2] as `0x${string}`;
    if (!voterAddress) throw new Error("Voter address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress)) 
        throw new Error("Invalid voter address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)");


    console.log("Proposal selected: ");
    const proposal = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "proposals",
      args: [BigInt(proposalIndex)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log("Voting to proposal", name);
    console.log("Confirm? (Y/n)");

    const stdin = process.stdin;
    stdin.addListener("data", async function (d) {
      if (d.toString().trim().toLowerCase() != "n") {
        const hash = await deployerClient.writeContract({
          address: contractAddress,
          abi,
          functionName: "vote",
          args: [BigInt(proposalIndex)],
        });
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Transaction confirmed");
      } else {
        console.log("Operation cancelled");
      }
      process.exit();
    });

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });