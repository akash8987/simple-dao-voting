// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VotingDAO {
    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCount;
        bool executed;
        address creator;
    }

    IERC20 public governanceToken;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    // proposalId => voterAddress => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 id, string description, address creator);
    event Voted(uint256 proposalId, address voter, uint256 weight);

    constructor(address _tokenAddress) {
        governanceToken = IERC20(_tokenAddress);
    }

    function createProposal(string memory _description) external {
        require(governanceToken.balanceOf(msg.sender) > 0, "Must hold tokens to propose");
        
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            voteCount: 0,
            executed: false,
            creator: msg.sender
        });

        emit ProposalCreated(proposalCount, _description, msg.sender);
    }

    function vote(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        
        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        proposal.voteCount += weight;
        hasVoted[_proposalId][msg.sender] = true;

        emit Voted(_proposalId, msg.sender, weight);
    }

    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id != 0, "Invalid proposal");
        require(!proposal.executed, "Already executed");
        // Logic for execution (e.g., releasing funds) would go here
        proposal.executed = true;
    }
}
