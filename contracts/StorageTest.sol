// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.18;
import "hardhat/console.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
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

contract TrustlessEscrow_Test {
    address address1;
    address address2;

    address user1;
    address user2;

    // I want confirmations in slot 0x04
    bytes30 __gap;
    bytes2 confirmations = 0x0000;

    constructor(
        address _user1,
        address _user2,
        address _user1Address,
        address _user2Address
    ) {
        user1 = _user1;
        user2 = _user2;
        address1 = _user1Address;
        address2 = _user2Address;
    }

    function getUser1() external view returns(address idk) {
        assembly {
            idk := sload(0x02)
        }
    }

    function getUser2() external view returns(address idk) {
        assembly {
            idk := sload(0x03)
        }
    }

    function getAddress1() external view returns(address idk) {
        assembly {
            idk := sload(0x00)
        }
    }

    function getAddress2() external view returns(address idk) {
        assembly {
            idk := sload(0x01)
        }
    }

    function getConfirmations() external view returns(bytes2 idk) {
        assembly {
            idk := sload(0x04)
        }
    }

    function change() external {
        // logAll();
        // console.log("---");
        assembly {
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
        // logAll();
        // console.log("---");
        assembly {
            // retrieve the state of user 2's confirmation
            let u2 := byte(1, sload(0x04))
            // if the state is already positive then revert
            if gt(u2, 0) {
                invalid()
            }
            // mask the slot to flip the bit
            //   0000 0001 0000 0000 0000 0000 0000 0000 0000...
            // ^ 0000 0000 0000 0000 0000 0000 0000 0000 0000...
            //   --------------------------------------------
            //   0000 0001 0000 0000 0000 0000 0000 0000 0000...
            let mask := 0x1000000000000000000000000000000000000000000000000000000000000
            let masked := xor(sload(0x04), mask)
            // store the new confirmations in the slot
            sstore(0x04, masked)
        }
        // logAll();
        // console.log("---");
    }

    function logAll() public view {
        bytes32 slot0;
        bytes32 slot1;
        bytes32 slot2;
        bytes32 slot3;
        bytes32 slot4;
        bytes32 slot5;
        bytes32 slot6;
        bytes32 slot7;
        assembly {
            slot0 := sload(0x00)
            slot1 := sload(0x01)
            slot2 := sload(0x02)
            slot3 := sload(0x03)
            slot4 := sload(0x04)
            slot5 := sload(0x05)
            slot6 := sload(0x06)
            slot7 := sload(0x07)
        }
        console.logBytes32(slot0);
        console.logBytes32(slot1);
        console.logBytes32(slot2);
        console.logBytes32(slot3);
        console.logBytes32(slot4);
        console.logBytes32(slot5);
        console.logBytes32(slot6);
        console.logBytes32(slot7);
    }
}