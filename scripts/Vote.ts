import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import {abi as tokenizeBallotAbi, bytecode as tokenizeBallotBytecode} from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json"
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {


    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const votePower = await publicClient.readContract({
    abi: tokenizeBallotAbi,
    address: "0xddaa489d2f87e9c8ba66f18b436cb455b5c758c4" as `0x${string}`,
    functionName: 'getVotePower',
    args: [account.address],
}) as bigint;

console.log(`This is the votePower ${votePower}`);


const proposal = ( await publicClient.readContract({
    address: "0xddaa489d2f87e9c8ba66f18b436cb455b5c758c4" as `0x${string}`,
    abi: tokenizeBallotAbi,
    functionName: "proposals",
    args: [BigInt(0)],
})) as any[];

console.log("proposal: ", hexToString(proposal[0], { size: 32 }));

const voteHash = await walletClient.writeContract({
    abi: tokenizeBallotAbi,
    address: "0xddaa489d2f87e9c8ba66f18b436cb455b5c758c4" as `0x${string}`,
    functionName: "vote",
    args:[BigInt(0), parseEther("0")]  
});

console.log("Voting...");
const receipt = await publicClient.waitForTransactionReceipt({hash: voteHash});
console.log("Vote transaction hash:", voteHash);
console.log("Vote transaction receipt:", receipt);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});