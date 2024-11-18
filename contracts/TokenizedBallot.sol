// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract Ballot {

    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;
    mapping (address => uint256) public votePowerSpent; // how much vote power each address has spent

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(
        bytes32[] memory proposalNames,
        IMyToken _tokenContract,
        uint256 _targetBlockNumber
    ) {

        tokenContract = _tokenContract;
        targetBlockNumber = _targetBlockNumber;
        // TODO: need to validate if target block number is in the past
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function getVotePower(address voter) public view returns (uint256 votePower_) {
        return tokenContract.getPastVotes(voter, targetBlockNumber) - votePowerSpent[voter];
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal, uint amount, address contractToBeVotedOn) external {
        uint256 votePower = 0;
        require(votePower >= amount, "Trying to vote with more votes than available");
        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
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

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}