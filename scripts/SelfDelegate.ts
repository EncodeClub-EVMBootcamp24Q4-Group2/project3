import { formatEther, createWalletClient, http, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { publicClient } from "./config";
import { abi as myTokenAbi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import * as dotenv from "dotenv";
import { sepolia } from "viem/chains";
dotenv.config();


async function main() {
    // Get arguments from command line
    const [privateKey] = process.argv.slice(2);
    if (!privateKey) {
        throw new Error(
            "Please provide the private key of the wallet to self delegate as an argument.\n"
        );
    }

    // Create wallet client for the token holder
    const account = privateKeyToAccount(`0x${privateKey}`);
    const addressToSelfDelegate = account.address;

    // get contract instance
    const MYTOKEN_ADDRESS = process.env.MYTOKEN_ADDRESS;
    if (!MYTOKEN_ADDRESS) {
        throw new Error("MyToken address not found in environment");
    }
    const myTokenContract = getContract({
        address: MYTOKEN_ADDRESS as `0x${string}`,
        abi: myTokenAbi,
        client: publicClient
    });
    
    // check voting power
    const currentBalance = await myTokenContract.read.balanceOf([addressToSelfDelegate]) as bigint;
    const votesBeforeSelfDelegate = await myTokenContract.read.getVotes([addressToSelfDelegate]) as bigint;
    
    if (currentBalance <= 0n) throw new Error("Address has no myToken");

    console.log(`From address ${addressToSelfDelegate} has ${formatEther(currentBalance)} MyToken and ${formatEther(votesBeforeSelfDelegate)} votes`);

    // Check for undelegated tokens
    const undelegatedTokens = currentBalance - votesBeforeSelfDelegate;
    if (undelegatedTokens <= 0n) {
        throw new Error("No new tokens to delegate. All tokens are already delegated.");
    }
    // self delegate
    const delegateTx = await myTokenContract.write.delegate([addressToSelfDelegate], {
        account,
        chain: sepolia,
    });

    await publicClient.waitForTransactionReceipt({ 
        hash: delegateTx,
        confirmations: 2
    });
    const votesAfterSelfDelegate = await myTokenContract.read.getVotes([addressToSelfDelegate]) as bigint;
    console.log(`From address ${addressToSelfDelegate} now has ${formatEther(votesAfterSelfDelegate)} votes, transaction hash: ${delegateTx}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

