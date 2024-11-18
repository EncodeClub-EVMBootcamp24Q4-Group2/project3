import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    
    // TODO
    const tokenContract = await viem.deployContract("MyToken");
    console.log(`Contract deployed at ${tokenContract.address}`);

    //fetching total supply
    const initialSupply = await tokenContract.read.totalSupply();
    console.log({initialSupply});

    // Fetching the role code
    const code = await tokenContract.read.MINTER_ROLE();
    console.log({code});

    //give account access
    // Giving role
    const roleTx = await tokenContract.write.grantRole([
        code,
        account2.account.address,
    ]);
  await publicClient.waitForTransactionReceipt({ hash: roleTx });

    // Minting tokens
    const mintTx = await tokenContract.write.mint(
        [deployer.account.address, parseEther("10")],
        { account: account2.account }
    );
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    
    const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.read.name(),
        tokenContract.read.symbol(),
        tokenContract.read.decimals(),
        tokenContract.read.totalSupply(),
      ]);
      console.log({ name, symbol, decimals, totalSupply });

    const tx = await tokenContract.write.transfer([
        account1.account.address,
        2n,
    ])

    await publicClient.waitForTransactionReceipt({ hash: tx });

    // const myBalance = await tokenContract.read.balanceOf([deployer.account.address]);
    // console.log(`My Balance is ${myBalance} decimals units`);
    // const otherBalance = await tokenContract.read.balanceOf([account1.account.address]);
    // console.log(`The Balance of Acc1 is ${otherBalance} decimals units`);

    //Viewing conerted balanced
    const myBalance = await tokenContract.read.balanceOf([deployer.account.address]);
    console.log(`My Balance is ${formatEther(myBalance)} decimals units`);
    const otherBalance = await tokenContract.read.balanceOf([account1.account.address]);
    console.log(`The Balance of Acc1 is ${formatEther(otherBalance)} decimals units`);
    
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});