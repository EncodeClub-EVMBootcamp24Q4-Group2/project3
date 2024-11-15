import { getContract, stringToHex } from "viem";
import { publicClient, deployerClient } from "./client";
import { abi as ballotAbi, bytecode as ballotBytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // Get MyToken contract address from env
    const myTokenAddress = process.env.MYTOKEN_ADDRESS;
    console.log("MyToken address:", myTokenAddress);
    // Get current block for reference
    const lastBlock = await publicClient.getBlockNumber();
    const targetBlock = lastBlock - 1n; // Use previous block for vote power snapshot

    // Get proposals from command line arguments, starting from index 2
    const proposals = process.argv.slice(2);
    if (proposals.length === 0) {
        throw new Error("Please provide at least one proposal as command line argument");
    }

    // Convert proposals to bytes32
    const proposalBytes = proposals.map((prop) => stringToHex(prop, { size: 32 }));

    // Deploy Ballot contract
    const ballotHash = await deployerClient.deployContract({
        abi: ballotAbi,
        bytecode: ballotBytecode as `0x${string}`,
        args: [proposalBytes, myTokenAddress, targetBlock]
    });

    const deploymentReceipt = await publicClient.waitForTransactionReceipt({ hash: ballotHash });
    const ballotAddress = deploymentReceipt.contractAddress;

    const ballotContract = getContract({
        address: ballotAddress as `0x${string}`,
        abi: ballotAbi,
        client: deployerClient,
    });

    console.log(
      "Ballot contract with proposals:", proposals,
      "deployed at:", ballotAddress,
      "with TXhash:", ballotHash,
      "using myToken at:", myTokenAddress, 
      "and target block:", targetBlock.toString(), "\n"
    );

    return { ballotContract, ballotAddress };
}

main().catch((err) => {
    console.error(err);
});