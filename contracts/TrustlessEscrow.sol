// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.18;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";
/**
         DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                Version 2, December 2004 

 Copyright (C) 2004 Sam Hocevar <sam(at)hocevar.net> 

 Everyone is permitted to copy and distribute verbatim or modified 
 copies of this license document, and changing it is allowed as long 
 as the name is changed. 

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

  0. You just DO WHAT THE FUCK YOU WANT TO.
 */
// erc20 <> erc20
contract TrustlessEscrowERC20 {
    address address1;
    address address2;

    address user1;
    address user2;

    // I want confirmations in slot 0x04
    bytes30 internal __gap;
    bytes2 public confirmations = 0x0000;

    uint256 timestamp;
    bytes1 _type = 0x00;

    constructor(
        address _user1,
        address _user2,
        address _user1Address,
        address _user2Address,
        uint256 interval
    ) {
        require(_user1Address != _user2Address);
        user1 = _user1;
        user2 = _user2;
        address1 = _user1Address;
        address2 = _user2Address;
        timestamp = block.timestamp + interval;
    }

    modifier onlyUser {
        assembly {
            if iszero(or(eq(origin(), sload(user1.slot)), eq(origin(), sload(user2.slot)))) {
                invalid()
            }
        }
        _;
    }

    function confirm() external onlyUser {
        assembly {
            let _user1 := sload(0x02)
            let _user2 := sload(0x03)
            // msg.sender == user1
            if eq(origin(), _user1) {
                // retrieve the state of user 1's confirmation
                let u1 := byte(0, sload(0x04))
                // if the state is already positive then revert
                if gt(u1, 0) {
                    invalid()
                }
                // mask the slot to flip the bit
                //   0000 0001 0000 0000 0000 0000 0000 0000 0000...
                // ^ 0000 0000 0000 0000 0000 0000 0000 0000 0000...
                //   --------------------------------------------
                //   0000 0001 0000 0000 0000 0000 0000 0000 0000...
                let mask := 0x100000000000000000000000000000000000000000000000000000000000000
                let masked := xor(sload(0x04), mask)
                // store the new confirmations in the slot
                sstore(0x04, masked)
            }
            // msg.sender == user2
            if eq(origin(), _user2) {
                // retrieve the state of user 2's confirmation
                let u2 := byte(1, sload(0x04))
                // if the state is already positive then revert
                if gt(u2, 0) {
                    invalid()
                }
                let mask := 0x1000000000000000000000000000000000000000000000000000000000000
                let masked := xor(sload(0x04), mask)
                // store the new confirmations in the slot
                sstore(0x04, masked)
            }
        }
    }

    function cancel() external onlyUser {
        assembly {
            if iszero(gt(timestamp(), sload(timestamp.slot))) {
                invalid()
            }
        }
        // return tokens to their owners
        IERC20(address1).transferFrom(address(this), user1, IERC20(address1).balanceOf(address(this)));
        IERC20(address2).transferFrom(address(this), user2, IERC20(address2).balanceOf(address(this)));
    }

    function execute() external {
        assembly {
            if iszero(eq(sload(0x04), 0x0101)) {
                invalid()
            }
        }
        // send tokens
        IERC20(address1).transferFrom(address(this), user2, IERC20(address1).balanceOf(address(this)));
        IERC20(address2).transferFrom(address(this), user1, IERC20(address2).balanceOf(address(this)));
    }
}

// erc721 <> erc721
contract TrustlessEscrowERC721 {
    address address1;
    address address2;

    address user1;
    address user2;

    // I want confirmations in slot 0x04
    bytes30 internal __gap;
    bytes2 public confirmations = 0x0000;

    uint256 timestamp;
    uint256 tokenId1;
    uint256 tokenId2;

    bytes1 _type = 0x01;

    constructor(
        address _user1,
        address _user2,
        address _user1Address,
        address _user2Address,
        uint256 _tokenId1,
        uint256 _tokenId2,
        uint256 interval
    ) {
        require(_user1Address != _user2Address);
        user1 = _user1;
        user2 = _user2;
        address1 = _user1Address;
        address2 = _user2Address;
        tokenId1 = _tokenId1;
        tokenId2 = _tokenId2;
        timestamp = block.timestamp + interval;
    }

    modifier onlyUser {
        assembly {
            if iszero(or(eq(origin(), sload(0x02)), eq(origin(), sload(0x03)))) {
                invalid()
            }
        }
        _;
    }   

    function getConfirmations() external view returns (bytes2) {
        return confirmations;
    }

    function confirm() external onlyUser {
        assembly {
            let _user1 := sload(0x02)
            let _user2 := sload(0x03)
            // msg.sender == user1
            if eq(origin(), _user1) {
                // retrieve the state of user 1's confirmation
                let u1 := byte(0, sload(0x04))
                // if the state is already positive then revert
                if gt(u1, 0) {
                    invalid()
                }
                // mask the slot to flip the bit
                //   0000 0001 0000 0000 0000 0000 0000 0000 0000...
                // ^ 0000 0000 0000 0000 0000 0000 0000 0000 0000...
                //   --------------------------------------------
                //   0000 0001 0000 0000 0000 0000 0000 0000 0000...
                let mask := 0x100000000000000000000000000000000000000000000000000000000000000
                let masked := xor(sload(0x04), mask)
                // store the new confirmations in the slot
                sstore(0x04, masked)
            }
            // msg.sender == user2
            if eq(origin(), _user2) {
                // retrieve the state of user 2's confirmation
                let u2 := byte(1, sload(0x04))
                // if the state is already positive then revert
                if gt(u2, 0) {
                    invalid()
                }
                let mask := 0x1000000000000000000000000000000000000000000000000000000000000
                let masked := xor(sload(0x04), mask)
                // store the new confirmations in the slot
                sstore(0x04, masked)
            }
        }
    }

    function cancel() external onlyUser {
        assembly {
            if iszero(gt(timestamp(), sload(timestamp.slot))) {
                invalid()
            }
        }
        // return tokens to their owners
        if (IERC721(address1).balanceOf(address(this)) > 0) {
            IERC721(address1).transferFrom(address(this), user1, tokenId1);
        }
        if (IERC721(address2).balanceOf(address(this)) > 0) {
            IERC721(address2).transferFrom(address(this), user2, tokenId2);
        }
    }

    function execute() external {
        assembly {
            if iszero(eq(sload(0x04), 0x0101)) {
                invalid()
            }
        }
        // send tokens
       IERC721(address1).transferFrom(address(this), user2, tokenId1);
       IERC721(address2).transferFrom(address(this), user1, tokenId2);
    }
}

// erc721 <> erc20
contract TrustlessEscrowHybrid {
    address address1;
    address address2;

    address user1;
    address user2;

    // I want confirmations in slot 0x04
    bytes30 internal __gap;
    bytes2 public confirmations = 0x0000;

    uint256 timestamp;
    uint256 tokenId;

    bytes1 _type = 0x02;

    constructor(
        address _user1,
        address _user2,
        address _user1Address,
        address _user2Address,
        uint256 _tokenId,
        uint256 interval
    ) {
        require(_user1Address != _user2Address);
        user1 = _user1;
        user2 = _user2;
        address1 = _user1Address;
        address2 = _user2Address;
        tokenId = _tokenId;
        timestamp = block.timestamp + interval;
    }

    modifier onlyUser {
        assembly {
            if iszero(or(eq(origin(), sload(0x02)), eq(origin(), sload(0x03)))) {
                invalid()
            }
        }
        _;
    }   

    function getConfirmations() external view returns (bytes2) {
        return confirmations;
    }

    function confirm() external onlyUser {
        assembly {
            let _user1 := sload(0x02)
            let _user2 := sload(0x03)
            // msg.sender == user1
            if eq(origin(), _user1) {
                // retrieve the state of user 1's confirmation
                let u1 := byte(0, sload(0x04))
                // if the state is already positive then revert
                if gt(u1, 0) {
                    invalid()
                }
                // mask the slot to flip the bit
                //   0000 0001 0000 0000 0000 0000 0000 0000 0000...
                // ^ 0000 0000 0000 0000 0000 0000 0000 0000 0000...
                //   --------------------------------------------
                //   0000 0001 0000 0000 0000 0000 0000 0000 0000...
                let mask := 0x100000000000000000000000000000000000000000000000000000000000000
                let masked := xor(sload(0x04), mask)
                // store the new confirmations in the slot
                sstore(0x04, masked)
            }
            // msg.sender == user2
            if eq(origin(), _user2) {
                // retrieve the state of user 2's confirmation
                let u2 := byte(1, sload(0x04))
                // if the state is already positive then revert
                if gt(u2, 0) {
                    invalid()
                }
                let mask := 0x1000000000000000000000000000000000000000000000000000000000000
                let masked := xor(sload(0x04), mask)
                // store the new confirmations in the slot
                sstore(0x04, masked)
            }
        }
    }

    function cancel() external onlyUser {
        assembly {
            if iszero(gt(timestamp(), sload(timestamp.slot))) {
                invalid()
            }
        }
        // return tokens to their owners
        if (IERC721(address1).balanceOf(address(this)) > 0) {
            IERC721(address1).transferFrom(address(this), user1, tokenId);
        }
        IERC20(address2).transferFrom(address(this), user2, IERC20(address2).balanceOf(address(this)));
    }

    function execute() external {
        assembly {
            if iszero(eq(sload(0x04), 0x0101)) {
                invalid()
            }
        }
        // send tokens
       IERC721(address1).transferFrom(address(this), user2, tokenId);
       IERC20(address2).transferFrom(address(this), user1, IERC20(address2).balanceOf(address(this)));
    }
}