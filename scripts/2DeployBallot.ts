// npx ts-node --files ./scripts/1DeployWithViem.ts "TokenAddress" "targetBlockNumber" "Proposals..."

import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address } from "viem";
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
    throw new Error("Minimum 3 parameters required: TokenAddress, targetBlockNumber, Proposals...");
  const proposals = parameters.slice(2);
  const tokenAddress = parameters[0] as `0x${string}`;
  const targetBlockNumber = BigInt(parameters[1]);

  if(blockNumber >= targetBlockNumber) {
    throw new Error("Target block number should be greater than the current block number");
    process.exit(1);
  }

  ////////////////////////////
  // Deploying a contract
  console.log("\nDeploying Ballot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [proposals.map((prop) => toHex(prop, { size: 32 })),
    tokenAddress,
    targetBlockNumber
    ],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);

  ////////////////////////////
  // Reading information from a deployed contract
  console.log("Proposals: ");
  for (let index = 0; index < proposals.length; index++) {
    const proposal = (await publicClient.readContract({
      address: receipt.contractAddress as Address,
      abi,
      functionName: "proposals",
      args: [BigInt(index)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});