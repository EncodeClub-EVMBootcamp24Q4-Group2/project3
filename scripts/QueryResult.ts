import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import {abi as tokenizeBallotAbi, bytecode as tokenizeBallotBytecode} from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json"
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const winner = await publicClient.readContract({
    address: "0xddaa489d2f87e9c8ba66f18b436cb455b5c758c4" as `0x${string}`,
    abi: tokenizeBallotAbi,
    functionName: "winnerName",
}) as `0x${string}`;

const name = hexToString(winner, { size: 32 });
console.log("Winning proposal:", name )

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});