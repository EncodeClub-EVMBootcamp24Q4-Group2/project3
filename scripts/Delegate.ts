import { getContract, parseEther, formatEther } from "viem";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import { assert } from "chai";
import * as dotenv from "dotenv";
dotenv.config();

const tokenAddress = process.env.ZZ_TOKEN_ADDRESS;
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const margieSepoliaPrv = process.env.MARGIE_SEPOLIA_PRV || "";

async function delegate() {
    assert(tokenAddress, 'Token address is needed for minting tokens!')

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    const margieAccount2 = privateKeyToAccount(`0x${margieSepoliaPrv}`);
    const walletClient = createWalletClient({
        account: margieAccount2,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    const tokenContract = {
        address: tokenAddress as `0x${string}`,
        abi, // abi linking to the artifact of the MyToken.sol
    };

    const delegateTx = await walletClient.writeContract({
        ...tokenContract,
        functionName: 'delegate',
        args: [margieAccount2.address],
    });

    console.log("Delegating...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    console.log("Delegate transaction hash:", delegateTx);
    console.log("Delegate transaction receipt:", receipt);
}

delegate().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


// npx hardhat run scripts/Delegate.ts - no args to pass