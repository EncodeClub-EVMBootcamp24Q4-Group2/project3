import { getContract, formatEther } from "viem";
import { publicClient, deployerClient } from "./client";
import { abi as tokenAbi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import { abi as ballotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // Get MyToken contract address from env
    const myTokenAddress = process.env.MYTOKEN_ADDRESS;
    const targetBlock = process.env.TARGET_BLOCK_KAI;

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

    // Get past transfer events up to target block from MyToken
    const transferEvents = await publicClient.getContractEvents({
      address: myTokenAddress as `0x${string}`,
      abi: tokenAbi,
      eventName: 'Transfer',
      fromBlock: 0n,
      toBlock: BigInt(targetBlock ?? "0"),
    });

    // Get unique addresses from transfer events
    const addresses = new Set<string>();
    transferEvents.forEach((log: any) => {
      if (log.args.from) addresses.add(log.args.from);
      if (log.args.to) addresses.add(log.args.to);
    });

    console.log("\nVoting power at block", targetBlock);
    console.log("----------------------------------------");

    // Print voting power for each address from Ballot contract
    for (const address of addresses) {
      if (address !== '0x0000000000000000000000000000000000000000') {
          const votes = await ballotContract.read.getVotePower([address]) as bigint;
          if (votes > 0n) {
              console.log(`${address}: ${formatEther(votes)} votes`);
          }
            }
        }
}

main().catch((err) => {
    console.error(err);
});