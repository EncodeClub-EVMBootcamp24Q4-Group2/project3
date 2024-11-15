// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    mapping(address => uint256) public votePowerSpent;
    uint256 public targetBlockNumber;

    constructor(
        bytes32[] memory _proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        // Validate if targetBlockNumber is in the past
        require(
            targetBlockNumber < block.number,
            "Error: target block number is not in the past"
        );
          for (uint i = 0; i < _proposalNames.length; i++) {
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        uint256 votePower = getVotePower(msg.sender);
        require(votePower >= amount, "Error: not enough vote power to vote");
        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function getVotePower(
        address voter
    ) public view returns (uint256 votePower_) {
        // return tokenContract.getPastVotes(voter, targetBlockNumber) - votePowerSpent[voter];
        uint256 pastVotes = tokenContract.getPastVotes(voter, targetBlockNumber);
        uint256 spentVotes = votePowerSpent[voter];
        votePower_ = pastVotes - spentVotes;

        // Debug logs
        console.log("Voter address:", voter);
        console.log("Past votes:", pastVotes);
        console.log("Spent votes:", spentVotes);
        console.log("Vote power:", votePower_);

    return votePower_;
    }

    
    // Need to implement add'l logic when two wining proposals have the same vote count
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Updated winningName function to detect case when there is no vote
     function winnerName() external view returns (bytes32 winnerName_) {
        uint winningProposal_ = winningProposal();
        // Check if all proposal have zero votes
        bool allZero = true;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > 0) {
                allZero = false;
                break;
            }
        }
        if (allZero) {
            console.log("All proposals have 0 votes.");
            return "";
        }
        winnerName_ = proposals[winningProposal_].name;
    }
}