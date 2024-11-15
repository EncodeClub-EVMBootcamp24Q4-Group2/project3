import { formatEther, getContract, parseEther } from "viem";
import { publicClient, deployerClient } from "./client";
import { abi as myTokenAbi } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // Get arguments from command line
    const [toAddress, mintAmount] = process.argv.slice(2);
    if (!toAddress || !mintAmount ) {
        throw new Error(
            "Please provide recipient address and mint amount as arguments\n"
        );
    }

    // get contract instance
    const MYTOKEN_ADDRESS = process.env.MYTOKEN_ADDRESS;
    if (!MYTOKEN_ADDRESS) {
        throw new Error("MyToken address not found in environment");
    }
    const myTokenContract = getContract({
        address: MYTOKEN_ADDRESS as `0x${string}`,
        abi: myTokenAbi,
        client: deployerClient
    });

    // Convert amount to wei
    const MINT_VALUE = parseEther(mintAmount);

    // mint tokens
    const mintTx = await myTokenContract.write.mint([toAddress, MINT_VALUE]);

    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
      `Minted ${formatEther(MINT_VALUE)} MyToken to account ${
        toAddress
      }\n`
    );

    const tokenBalance = await myTokenContract.read.balanceOf([toAddress]) as bigint;
    console.log(
      `Account ${
        toAddress
      } has ${formatEther(tokenBalance)} MyToken Now\n`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });