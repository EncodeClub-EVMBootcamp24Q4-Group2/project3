import { client, deployer } from '../scripts/config';

async function testConfig() {
    console.log('Deployer Address:', deployer.address);
    console.log('Client Chain ID:', await client.getChainId());
}

testConfig().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});