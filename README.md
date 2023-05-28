# Trustless Escrow
A premissionless, scalable escrow system for the CryptScrow Codeathon.

# Usage
## Creating an Escrow
#### ERC20 <> ERC20
Call `create20` on a `TrustlessRouter` with the following parameters:
 - `user1`: The first user in the trade
 - `user2`: The second user in the trade
 - `token1`: The token `user1` is going to provide
 - `token2`: The token `user2` is going to provide
 - `time`: The time either user must wait before the escrow can be cancelled

#### ERC721 <> ERC721
Call `create721` on a `TrustlessRouter` with the following parameters:
 - `user1`: The first user in the trade
 - `user2`: The second user in the trade
 - `token1`: The token `user1` is going to provide
 - `token2`: The token `user2` is going to provide
 - `tokenId1`: The tokenId `user1` is going to provide
 - `tokenId2`: The tokenId `user2` is going to provide
 - `time`: The time either user must wait before the escrow can be cancelled

#### ERC20 <> ERC721
Call `createHybrid` on a `TrustlessRouter` with the following parameters:
 - `user1`: The first user in the trade
 - `user2`: The second user in the trade
 - `token1`: The ERC20 token `user1` is going to provide
 - `token2`: The ERC721 token `user2` is going to provide
 - `tokenId`: The tokenId `user2` is going to provide
 - `time`: The time either user must wait before the escrow can be cancelled

## Interacting with an Escrow
#### Payment
When a user wants to pay their side of the escrow, they can send the token(s) directly to the escrow contract. If the wrong asset is sent, it cannot be recovered. If the wrong amount of asset is sent, the user should refrain from confirming the escrow, and wait until the waiting period is over to cancel the escrow.

#### Confirming
To execute an escrow trade, both users must confirm the escrow. This is done with the `confirm()` function. Once you have confirmed, you cannot un-confirm, which is why we recommend users wait until both sides of the trade are securely in the escrow contract to confirm.

#### Executing
To execute an escrow trade, anyone can call the `execute()` function and send both users their token(s).

#### Cancelling
After a predetermined waiting period, either user can cancel the trade and all assets in the trade will be returned to their depositors.