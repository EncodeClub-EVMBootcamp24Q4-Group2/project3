// npx ts-node --files ./scripts/4DelegateVotePower.ts "delegateAddress"

import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address, getContract } from "viem";
import { abi, bytecode } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
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
    throw new Error("Minimum 1 parameters required: DelegateAddress");
  const tokenAddress = deployer.account.address;
  const delegateAddress = parameters[0] as `0x${string}`;

  console.log("Delegating Tokens from tokenAddress ", tokenAddress, " to delegateAddress ", delegateAddress);

  ////////////////////////////
  // Get Contract
  const myTokenContract = getContract( {
    address: tokenAddress,
    abi: abi,
    client: deployer,
  });

  // Mint the tokens
  const delegateTx = await myTokenContract.write.delegate([delegateAddress]);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: delegateTx });
  console.log("Completed Transaction Number: ", delegateTx);
  console.log("Receipt", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});