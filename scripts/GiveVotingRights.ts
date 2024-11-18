import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();
import { publicClient, deployerClient } from "./client";

async function main() {
    console.log("GrantRight script started with parameters: contract address, voter address");


    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
      throw new Error("Parameters not provided");

    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
      throw new Error("Invalid contract address");

    // Get voter address from the arguments
    const voterAddress = parameters[1] as `0x${string}`;
    if (!voterAddress) throw new Error("Voter address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress)) 
        throw new Error("Invalid voter address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)");

    // check if voter is deployer
    if (voterAddress === deployerClient.account.address) {
        console.log("chairperson cannot grant voting rights to themselves");
        process.exit(1);
    }
    
        let allowVotingHash = await deployerClient.writeContract({
            abi: abi,
            address: contractAddress, // OR USE: as `0x${string}`
            functionName: "giveRightToVote",
            args:[ voterAddress ]
        });
    
    
        console.log("Transaction hash:", allowVotingHash);
        console.log("Waiting for confirmations...");
        let receipt = await publicClient.waitForTransactionReceipt({ hash: allowVotingHash });
        console.log("Below is the receipt object for voter: ", voterAddress);
        console.log("Transaction receipt object: ", receipt);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });