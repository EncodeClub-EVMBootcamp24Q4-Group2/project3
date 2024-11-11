import { deploy } from "@nomicfoundation/ignition-core";
import { abi as _ballotAbi, bytecode as _ballotBytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { client, deployerClient } from './config';
import { getContract, stringToHex } from 'viem';
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const myTokenAddress = process.env.MYTOKEN_ADDRESS;
    const targetBlock = (await client.getBlockNumber()) - 1n;
    
    // Convert proposals to bytes32
    const proposalNames = ["Vanilla", "Chocolate", "Strawberry"].map(name => stringToHex(name).padEnd(66, '0'));
    
    const deployTx = await deployerClient.deployContract({
        abi: _ballotAbi,
        bytecode: _ballotBytecode as `0x${string}`,
        args: [proposalNames, myTokenAddress, targetBlock],
    });

    console.log("Deploying TokenizedBallot contract...");
    const receipt = await client.waitForTransactionReceipt({hash: deployTx});

    console.log("TokenizedBallot deployed to: ", receipt.contractAddress); // TokenizedBallot contract address
    console.log("Transaction hash: ", deployTx); // Transaction hash
    console.log("MyToken address: ", myTokenAddress);  // MyToken contract address
    console.log("Proposal names:", proposalNames.map(name => Buffer.from(name.slice(2), 'hex').toString().replace(/\0/g, ''))); // Proposal names
    console.log("Target block: ", targetBlock.toString()); // Target block number

    return {deployTx, receipt};
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});