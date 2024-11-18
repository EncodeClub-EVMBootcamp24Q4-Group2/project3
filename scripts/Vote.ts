import { getContract, parseEther, formatEther } from "viem";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi as BallotAbi } from "../artifacts/contracts/TokenizedBallot.sol/Ballot.json";
import { assert } from "chai";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const margieSepoliaPrv = process.env.MARGIE_SEPOLIA_PRV || "";
const ballotAddress = process.env.ZZ_BALLOT_ADDRESS;


// async function getProposalNames() {
//     const ballotContract = {
//         address: ballotAddress,
//         abi: ballotAbi,
//     };

//     const proposalNames: string[] = [];
//     let i = 0;
//     while (true) {
//         try {
//             const proposal = await publicClient.readContract({
//                 ...ballotContract,
//                 functionName: 'proposals',
//                 args: [i],
//             }) as Proposal;
//             proposalNames.push(bytes32ToString(proposal.name));
//             i++;
//         } catch (error) {
//             break;
//         }
//     }

//     return proposalNames;
// }

// TODO: Update to use readline to take in the user prompt and display their options
async function vote() {
    // const proposalNames = await getProposalNames();
    // console.log('Available options to vote on:\n');
    // proposalNames.forEach((name, index) => {
    //     console.log(`[${index}] ${name}`);
    // });
    
    const [proposalIndex, ballotsToCast] = process.argv.slice(2);
    assert(ballotsToCast, 'Need to specify a number of votes to give ')

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    const margieVotingAccount = privateKeyToAccount(`0x${margieSepoliaPrv}`);
    const walletClient = createWalletClient({
        account: margieVotingAccount,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    // let's make sure the voting client has proper voting power
    const ballotContract = {
        address: ballotAddress as `0x${string}`,
        abi: BallotAbi,
    }

    const votePower = await publicClient.readContract({
        ...ballotContract,
        functionName: 'getVotePower',
        args: [margieVotingAccount.address]
    });

    console.log(`Voting power ${votePower}`);
    

    if (BigInt(votePower) - BigInt(ballotsToCast) <= 0n) {
        throw new Error(`You don't have enough vote power for to cast a ballot`)
    } else {
        console.log(`Voting power for account ${margieVotingAccount.address} is  ${votePower}`);
    }


    const voteTx = await walletClient.writeContract({
        ...ballotContract,
        functionName: 'vote',
        args: [BigInt(proposalIndex), parseEther(ballotsToCast)]
    })

    console.log("Voting...");
    const receipt = await publicClient.waitForTransactionReceipt({hash: voteTx});
    console.log("Vote transaction receipt:", receipt);
}

vote().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


// npx ts-node --files scripts/Vote.ts <INDEX_PROPSOAL> <NUMBER_OF_VOTES>