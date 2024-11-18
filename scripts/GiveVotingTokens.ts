import { createPublicClient, http, createWalletClient, getContract, parseEther} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import {abi as tokentAbi, bytecode as tokenBytecode} from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json"
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


const tokenContract = getContract({
    address: "0x924279aec37d890c36b561df5a23c48222876dc7" as `0x${string}`,
    abi: tokentAbi,
    client: walletClient
});

const mintHash = await tokenContract.write.mint(["0x881c9d6dDb6fB5754e24a41Ff4394D6b565fDDD7", parseEther("10")]);

const receipt = await publicClient.waitForTransactionReceipt({ hash: mintHash });
console.log("Transaction hash:", mintHash);
console.log("mint receipt ");

console.log(receipt);

const tokenBalance = await tokenContract.read.balanceOf(["0x881c9d6dDb6fB5754e24a41Ff4394D6b565fDDD7"]) as bigint;

console.log("This is the token balance",tokenBalance);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});