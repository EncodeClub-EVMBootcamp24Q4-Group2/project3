// npx ts-node --files ./scripts/5CastVote.ts "ballotAddress" "proposalIndex" "numVotes"

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
  if (!parameters || parameters.length < 3)
    throw new Error("Minimum 3 parameters required: ballotAddress proposalIndex numVotes");
  const ballotAddress = parameters[0] as `0x${string}`;
  const proposalIndex = BigInt(parameters[1]);
  const numVotes = parameters[2];

  console.log("Casting ", numVotes, " votes to proposal ", proposalIndex, " in ballot ", ballotAddress);

  const ballotContract = getContract( {
    address: ballotAddress,
    abi: abi,
    client: deployer,
  });

  // Mint the tokens
  const delegateTx = await ballotContract.write.vote([BigInt(proposalIndex), parseEther(numVotes.toString())]);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: delegateTx });
  console.log("Completed Transaction Number: ", delegateTx);
  console.log("Receipt", receipt);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});