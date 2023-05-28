// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.18;
import {TrustlessEscrowERC20, TrustlessEscrowERC721, TrustlessEscrowHybrid} from "./TrustlessEscrow.sol";

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
contract TrustlessRouter {
    mapping (uint256 => address) public escrows;

    function create20(address user1, address user2, address token1, address token2, uint256 time) external payable {
        address _address = address(new TrustlessEscrowERC20(
            user1,
            user2,
            token1,
            token2,
            time
        ));
        uint256 index = uint(keccak256(abi.encode(user1, user2)));
        assembly {
            mstore(0, index)
            mstore(32, escrows.slot)
            let hash := keccak256(0, 64)
            sstore(hash, _address)
        }
    }

    function create721(address user1, address user2, address token1, address token2, uint256 tokenId1, uint256 tokenId2, uint256 time) external payable {
        address _address = address(new TrustlessEscrowERC721(
            user1,
            user2,
            token1,
            token2,
            tokenId1,
            tokenId2,
            time
        ));
        uint256 index = uint(keccak256(abi.encode(user1, user2)));
        assembly {
            mstore(0, index)
            mstore(32, escrows.slot)
            let hash := keccak256(0, 64)
            sstore(hash, _address)
        }
    }

    function createHybrid(address user1, address user2, address token1, address token2, uint256 tokenId, uint256 time) external payable {
        address _address = address(new TrustlessEscrowHybrid(
            user1,
            user2,
            token1,
            token2,
            tokenId,
            time
        ));
        uint256 index = uint(keccak256(abi.encode(user1, user2)));
        assembly {
            mstore(0, index)
            mstore(32, escrows.slot)
            let hash := keccak256(0, 64)
            sstore(hash, _address)
        }
    }
}