import { getContract, stringToHex } from 'viem';
import { createPublicClient, createWalletClient, http,  } from "viem";
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from "viem/accounts";
import {abi as tokentAbi, bytecode as tokenBytecode} from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json"
import * as dotenv from "dotenv";
dotenv.config();
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";


async function main() {
  const client = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const account = privateKeyToAccount(`0x${deployerPrivateKey}`);

const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const tokenContract = await walletClient.deployContract({
  abi: tokentAbi,
  bytecode: tokenBytecode as `0x${string}`,
})

console.log("Deploying Token contract");
const receipt = await client.waitForTransactionReceipt({hash: tokenContract});

console.log("Token deployed to: ", receipt.contractAddress);
console.log("Transaction hash: ", tokenContract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});