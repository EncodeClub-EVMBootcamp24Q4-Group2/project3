// npx ts-node --files ./scripts/3GiveVoteToken.ts "TokenAddress" "ToAddress" "NumTokens"

import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address, getContract, parseEther } from "viem";
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
  if (!parameters || parameters.length < 3)
    throw new Error("Minimum 3 parameters required: TokenAddress, ToAddress, numberTokens");
  const tokenAddress = parameters[0] as `0x${string}`;
  const toAddress = parameters[1] as `0x${string}`;
  const numTokens = parseEther(parameters[2]);

  console.log("Sending ", numTokens, " tokens to ", toAddress);

  ////////////////////////////
  // Get Contract
  const myTokenContract = getContract( {
    address: tokenAddress,
    abi: abi,
    client: deployer,
  });

  // Mint the tokens
  const mintTx = await myTokenContract.write.mint([toAddress, numTokens]);
  await publicClient.waitForTransactionReceipt({ hash: mintTx });
  console.log("Minted ", numTokens, " tokens to ", toAddress);
  console.log("Transaction Number: ", mintTx);

  const tokenBalance = await myTokenContract.read.balanceOf([toAddress]) as bigint;
  console.log("Balance of ", toAddress, " is ", tokenBalance);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});