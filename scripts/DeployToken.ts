import { abi as _abi, bytecode as _bytecode } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";
import { client, deployerClient } from './config';

async function main() {
    let transactionHash: string;
    try {
        // Deploy the contract
        transactionHash = await deployerClient.deployContract({
            abi: _abi,
            bytecode: _bytecode as `0x${string}`,
        });

        // Log the transaction hash
        console.log('Transaction hash:', transactionHash);
    } catch (error) {
        console.error('Error deploying contract:', error);
        return;
    }
    
    const deploymentReceipt = await client.waitForTransactionReceipt({ hash: transactionHash as `0x${string}` });
    const myTokenAddress = deploymentReceipt.contractAddress;
    console.log('MyToken address:', myTokenAddress);
}

// Run the main function
main().catch((error) => {
    console.error('Error in main function:', error);
    process.exitCode = 1;
});

export { main as deployMyToken };