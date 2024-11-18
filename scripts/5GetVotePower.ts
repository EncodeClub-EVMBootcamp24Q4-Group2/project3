// npx ts-node --files ./scripts/5GetVotePower.ts "BallotAddress"

import { createPublicClient, http, createWalletClient, formatEther, parseEther, toHex, hexToString, Address, getContract } from "viem";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  ////////////////////////////
  // Creating a public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  ////////////////////////////
  // Creating a wallet client
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });

  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  ////////////////////////////
  // Parse Arguments
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Minimum 1 parameters required: ballotAddress");
  const ballotAddress = parameters[0] as `0x${string}`;

    const votePower = await publicClient.readContract({
      address: ballotAddress,
      abi,
      functionName: "getVotePower",
      args: [ballotAddress],
    }) as bigint;
    console.log("Vote Power: ", votePower);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});