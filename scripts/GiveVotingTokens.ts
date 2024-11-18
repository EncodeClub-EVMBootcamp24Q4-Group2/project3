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

async function giveVotingTokens() {
    // destination address and token amount as cli values
    const [destinationAddress, tokenAmount] = process.argv.slice(2);        
    const mintValue = parseEther(tokenAmount);

    assert(tokenAddress, 'Token address is needed for minting tokens!')

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });


    const tokenContract = getContract({
        address: tokenAddress as `0x${string}`,
        client: { public: publicClient, wallet: walletClient }, // links to Metamask wallet as walletClient and publicClient for general
        abi, // abi linking to the artifact of the MyToken.sol
    });

    const mintTx = await tokenContract.write.mint([destinationAddress, mintValue]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
        `Minted ${formatEther(mintValue)} MyToken to account ${destinationAddress}\n`
    );

    // now read balance of destination address just to make sure
    const destinationAddressBalance = await tokenContract.read.balanceOf([destinationAddress]);
    console.log(`Destination address is ${formatEther(destinationAddressBalance as bigint)} tokens`);
}

giveVotingTokens().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


// npx hardhat run scripts/GiveVotingTokens.ts 0x6a4Dc8c9828c6FD74311F3CF0D79a0792205e86e 13
// address is non-group wallet test address