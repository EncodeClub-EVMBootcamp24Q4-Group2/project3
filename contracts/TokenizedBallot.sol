// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot  {
    struct Proposal {
        bytes32 name;   
        uint voteCount; 
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    mapping (address => uint256) public votePowerSpent;
    uint256 targetBlockNumber;
    
    constructor(
        bytes32[] memory proposalNames,
        address _tokenContract, 
        uint256 _targetBlockNumber
    ) {
        require(block.number >= targetBlockNumber, "Error: Block number must be in the future");

        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(uint256 proposal, uint256 amount) public {
        require(block.number < targetBlockNumber, "Error: Voting is closed");
        uint256 votePower = getVotePower(msg.sender);
        require(votePower >= amount, "Error: trying to vote with more votes than available");
        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function getVotePower(address voter) public view returns (uint256)
    {
        return tokenContract.getPastVotes(voter, targetBlockNumber) - votePowerSpent[voter];
    }

    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }
    
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
