import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { abi as _Abi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import { client } from './config';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, "../.env") });

const tokenAddress = process.env.MYTOKEN_ADDRESS!;
let privateKey = process.env.PRIVATE_KEY!;

if (!tokenAddress || !privateKey) {
    throw new Error('Please set MYTOKEN_ADDRESS and PRIVATE_KEY in your .env file');
}

// Ensure the PRIVATE_KEY starts with '0x'
if (!privateKey.startsWith("0x")) {
    console.warn(
        "⚠️ PRIVATE_KEY does not start with '0x'. Prepending it automatically."
    );
    privateKey = `0x${privateKey}`;
}

async function delegate() {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({
        chain: sepolia,
        transport: http(`${process.env.ALCHEMY_URL}${process.env.ALCHEMY_API_KEY}`),
        account: account,
    });

    const tokenContract = {
        address: tokenAddress as `0x${string}`,
        abi: _Abi,
    };

    const delegateTx = await walletClient.writeContract({
        ...tokenContract,
        functionName: 'delegate',
        args: [account.address],
    });

    console.log("Delegating...");
    const receipt = await client.waitForTransactionReceipt({ hash: delegateTx });
    console.log("Delegate transaction hash:", delegateTx);
    console.log("Delegate transaction receipt:", receipt);
}

delegate().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});