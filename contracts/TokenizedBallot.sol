// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract Ballot {

    struct Proposal {
        bytes32 name;   
        uint voteCount; 
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;
    mapping (address => uint256) public votePowerSpent;

    constructor(
        bytes32[] memory _proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        // TODO: Validate if targetBlockNumber is in the past
        for (uint i = 0; i < _proposalNames.length; i++) {
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));
        }
    }


    function vote(uint proposal, uint amount) external {
        uint256 votePower = 0;
        require(votePower >= amount, "Error: trying to vote with more votes than available");
        votePowerSpent[msg.sender] += amount; 
        proposals[proposal].voteCount += amount;
    }

function getVotePower(address voter) public view returns (uint256) {
    return tokenContract.getPastVotes(voter, targetBlockNumber) - votePowerSpent[msg.sender];

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