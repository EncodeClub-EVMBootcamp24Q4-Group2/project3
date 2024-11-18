import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address } from "viem";
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

    const delegateHash = await walletClient.writeContract({
        address: "0xc2d81329598e7e47e412a8e6ea61ca535b34b9db" as `0x${string}`,
        abi: tokentAbi,
        functionName: "delegate",
        args: ["0x9E3885eCcDc7E6F61B291B03838313F83799e03A"],
      });


      
      console.log("Waiting for confirmations...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash:delegateHash });
      console.log("Transaction hash:", delegateHash);
      console.log(receipt);
    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});