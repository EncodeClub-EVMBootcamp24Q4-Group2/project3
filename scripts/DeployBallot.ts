import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

const MINT_VALUE = parseEther("10");

async function deployBallot() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    const contract = await viem.deployContract("MyToken");
    console.log(`Token contract deployed at ${(await contract).address}\n`);

    const mintTx = await contract.write.mint([account1.account.address, MINT_VALUE]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(`Minted ${MINT_VALUE.toString()} decimal units to account ${account1.account.address}`);
}

deployBallot().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });