import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    
// Deploying with hardhat helper functions
const tokenContract = await viem.deployContract("MyToken");
console.log(`Contract deployed at ${tokenContract.address}`);

//Fetching total supply
const initialSupple = await tokenContract.read.totalSupply();
console.log({ initialSupple });

// Fetching the role code
const code = await tokenContract.read.MINTER_ROLE();
console.log(code);

//Minting tokens error
const mintTx = await tokenContract.write.mint(
  [deployer.account.address, parseEther("10")],
  { account: account2.account }
);
await publicClient.waitForTransactionReceipt({ hash: mintTx });

// Read smart contract
const [name, symbol, decimals, totalSupply] = await Promise.all([
  tokenContract.read.name(),
  tokenContract.read.symbol(),
  tokenContract.read.decimals(),
  tokenContract.read.totalSupply(),
]);
console.log({ name, symbol, decimals, totalSupply });

// Sending a transaction
const tx = await tokenContract.write.transfer([
  account1.account.address,
  2n,
]);
await publicClient.waitForTransactionReceipt({ hash: tx });

//Viewing balace
// const myBalance = await tokenContract.read.balanceOf([deployer.account.address]);
// console.log(`My Balance is ${myBalance} decimals units`);
// const otherBalance = await tokenContract.read.balanceOf([account1.account.address]);
// console.log(
//   `The Balance of Acc1 is ${otherBalance} decimals units`
// );

//Viewing coverted balances

const myBalance = await tokenContract.read.balanceOf([deployer.account.address]);
console.log(`My Balance is ${formatEther(myBalance)} ${symbol}`);
const otherBalance = await tokenContract.read.balanceOf([account1.account.address]);
console.log(
  `The Balance of Acc1 is ${formatEther(otherBalance)} ${symbol}`
);


}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});