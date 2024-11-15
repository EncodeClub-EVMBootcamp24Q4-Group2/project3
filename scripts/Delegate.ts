import { formatEther, createWalletClient, http, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { publicClient } from "./client";
import { abi as myTokenAbi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import * as dotenv from "dotenv";
import { sepolia } from "viem/chains";
dotenv.config();


async function main() {
    // Get arguments from command line
    const [privateKey, toAddress] = process.argv.slice(2);
    if (!privateKey || !toAddress) {
        throw new Error(
            "Please provide the private key of the wallet to delegate from as argument.\n" +
            "Please provide delegate to address as argument\n" +
            "To self delegate, provide the private key and address from the same wallet\n"
        );
    }

    // Create wallet client for the token holder
    const account = privateKeyToAccount(`0x${privateKey}`);
    const fromAddress = account.address;

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

    const fromVotesBefore = await myTokenContract.read.getVotes([fromAddress]) as bigint;
    const toVotesBefore = await myTokenContract.read.getVotes([toAddress]) as bigint;

    // check if self-delegate
    if (fromAddress === toAddress) throw new Error ("Please use SelfDelegate.ts for self-delegation")

    // check voting power

    if (fromVotesBefore <= 0n) throw new Error("No vote to delegate");

    console.log(`From address ${fromAddress} has ${formatEther(fromVotesBefore)} votes before delegation`);
    console.log(`To address ${toAddress} has ${formatEther(toVotesBefore)} votes before delegation`);

    // delegate
    const delegateTx = await myTokenContract.write.delegate([toAddress], {
        account,
        chain: sepolia,
    });

    await publicClient.waitForTransactionReceipt({ 
        hash: delegateTx,
        confirmations: 2
    });

    const fromVotesAfter = await myTokenContract.read.getVotes([fromAddress]) as bigint;
    const toVotesAfter = await myTokenContract.read.getVotes([toAddress]) as bigint;

    console.log(`From address ${fromAddress} now has ${formatEther(fromVotesAfter)} votes, while to address ${toAddress} now has ${formatEther(toVotesAfter)} votes, transaction hash: ${delegateTx}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });