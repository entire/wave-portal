// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    // current total waves
    uint256 totalWaves; 

    // seed for generating random number
    uint256 private seed;

    // event that happens when newwave takes place
    event NewWave(address indexed from, uint256 timestamp, string message);

    // wave struct
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    // array of wave structs
    Wave[] waves;

    // address => uint mapping
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log ("smart contract constructor");
    }

    function wave(string memory _message) public {
        // required 5 min cool down period between waves
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Wait 5 mins"
        );

        // update current timestamp
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        // push to waves
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // generate pseudo random number between 0 and 100
        uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("random # generated: %s", randomNumber);

        seed = randomNumber;

        // 50% chance of winning
        if (randomNumber < 50) {
            console.log ("%s has won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "trying to withdraw more than the contract has"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw from contract.");
        }

        // emit newwave event
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d totalWaves", totalWaves);
        return totalWaves;
    }
}
