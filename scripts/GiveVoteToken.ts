import { parseEther, formatEther, getContract } from "viem";
import { abi as _Abi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import { client, deployerClient } from "./config";
import { resolve } from 'path';
import * as dotenv from "dotenv";

dotenv.config({ path: resolve(__dirname, "../.env") });

const tokenAddress = process.env.MYTOKEN_ADDRESS!;
if (!tokenAddress) {
    throw new Error('Token address not found.');
}

async function main() {
    // Get the recipient address and amount to mint from the command line
    const [toAddress, mintAmount] = process.argv.slice(2);
    const MINT_VALUE = parseEther(mintAmount);

    // Console log the recipient address and amount to mint
    console.log(`Minting MyToken to account ${toAddress}...`);
    console.log(`Minting amount: ${mintAmount}...`);

    const tokenContract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: _Abi,
        client: deployerClient
    });

    // Mint the tokens
    const mintTx = await tokenContract.write.mint([toAddress, MINT_VALUE]);

    await client.waitForTransactionReceipt({ hash: mintTx });
    console.log(
        `Minted ${formatEther(MINT_VALUE)} MyToken to account ${toAddress}\n`
    );

    const tokenBalance = await tokenContract.read.balanceOf([toAddress]) as bigint;
    console.log(
        `Account ${toAddress} has ${formatEther(tokenBalance)} MyToken Now\n`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});