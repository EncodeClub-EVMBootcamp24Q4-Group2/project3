import { formatEther } from "viem";
import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const tokenAddress = process.env.ZZ_TOKEN_ADDRESS;

async function checkVotingPower() {
    const [address] = process.argv.slice(2);

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const tokenContract = {
        abi,
        address: tokenAddress as `0x${string}`,
    }

    const votePower = await publicClient.readContract({
        ...tokenContract,
        functionName: 'getVotes',
        args: [address]
    });

    console.log(`The voting power for address ${address} is ${formatEther(votePower as bigint)} of MyToken`);
    
}

checkVotingPower().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


// npx ts-node --files scripts/CheckVotingPower.ts <ADDRESS_TO_CHECK>