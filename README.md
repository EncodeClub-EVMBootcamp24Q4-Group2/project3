# project3
Develop and run scripts for “TokenizedBallot.sol” within your group to:
1. Give voting tokens
2. Delegating voting power
3. Casting votes
4. Checking vote power
5. Querying results  
Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed

## Deploy token
- Transaction hash: 0xbb61764e9ced8d723ec819d5f5939a0786ea4eb6c46d753a6a554eb0645d5917
- MyToken address: 0x5064c5eed17f73c3711adef19c87652a2113277f
![Deployed Token](img/DeployedToken.png)
- Etherscan transaction records for deploy, mint and self-delegate voting right
![Etherscan](img/tokenEtherscan.png)  

## Deploy ballot
- Transaction hash: 0x7483c8478de7ada4db14d012ec38a4f0eefe338c73031ffbd5c3c7a90e5db018
- Ballot address: 0xc795c9f205c5ec21968af8eb16692bd245131a12
- Proposals:  [ 'Vanilla', 'Chocolate', 'Strawberry' ]
- Target block: 7053126
![Deploy Ballot](img/DeployedBallot.png)

1. Give voting tokens 
![Mint Token](img/MintToken.png)

2. Self Delegate
- Delegate transaction hash: 0xaf6f53f72609986a3d8d8e6eebc1d7a22f4ad3c0b5cc1b7b3c74665e060d534f
- Delegate transaction receipt:
- blockHash: '0x21f0c6efb4256083b4c4d95d146c4d0555861a84f569092ea22c64539e225d55',
- blockNumber: 7079145n,
- contractAddress: null,
- cumulativeGasUsed: 16409040n,
- effectiveGasPrice: 99581255n,
- from: '0xb3c1cd1ab988294747fb0049a567a83ff64cd625',
- gasUsed: 96869n,
![Self Delegate](img/selfDelegate.png)

3. Vote  
❌ Error - the wallet has token and delegated voting right but still can't vote. 
![Vote](img/VoteError.png)

4. Checking vote power
![check voting power](img/VotingPower.png)

5. Query results
❌ Error - can't account for edge case such as all proposals have zero votes or tie. 
![Query results](img/QueryResults.png)

Test  
a. Test if account has the right balance after minting
![See token balance](img/testBalance.png)
