import { getContract } from "viem";
import { publicClient, deployerClient } from "./client";
import { abi as myTokenAbi, bytecode as myTokenBytecode } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";

import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // Deploy New MyToken contract
    const myTokenHash = await deployerClient.deployContract({
        abi: myTokenAbi,
        bytecode: myTokenBytecode as `0x${string}`,
    });
    
    const deploymentReceipt = await publicClient.waitForTransactionReceipt({ hash: myTokenHash });  
    const myTokenAddress = deploymentReceipt.contractAddress;

    const myTokenContract = getContract({
        address: myTokenAddress as `0x${string}`,
        abi: myTokenAbi,
        client: deployerClient,
    });
    console.log("MyToken is deployed contract at:", myTokenAddress, "with hash", myTokenHash);
    return { myTokenContract, myTokenAddress };
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

export { main as deployMyToken };