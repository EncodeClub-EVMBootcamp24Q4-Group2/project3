import { getContract, stringToHex } from 'viem';
import { createPublicClient, createWalletClient, http,  } from "viem";
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from "viem/accounts";
import {abi as tokenizeBallotAbi, bytecode as tokenizeBallotBytecode} from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json"
import * as dotenv from "dotenv";
dotenv.config();
const PROPOSALS = ["Dogs", "Cats", "Birds"];
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";


async function main() {

const proposalHex = PROPOSALS.map(prop => stringToHex(prop, {size:32}))
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

const targetBlock = (await client.getBlockNumber()) - 1n;

const tokenizBallotContract = await walletClient.deployContract({
  abi: tokenizeBallotAbi,
  bytecode: tokenizeBallotBytecode as `0x${string}`,
  args: [proposalHex, "0xc2d81329598e7e47e412a8e6ea61ca535b34b9db",targetBlock]
})

const receipt = await client.waitForTransactionReceipt({hash: tokenizBallotContract});
console.log("TokenizedBallot deployed to: ", receipt.contractAddress);
console.log("Transaction hash: ", tokenizBallotContract);
console.log("Target block: ", targetBlock.toString());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});