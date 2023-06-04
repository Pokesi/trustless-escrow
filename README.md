# Trustless Escrow
A premissionless, scalable escrow system for the CryptScrow Codeathon.

# Usage
## Contracts
[TrustlessRouter](./contracts/TrustlessRouter.sol)
[TrustlessEscrow](./contracts/TrustlessEscrow.sol)

<br>📝 You need a `key.ts` file in the following format to deploy the contracts to the Horizen testnet:
```ts
export default ["PRIVATE_KEY", "ETHERSCAN_KEY"]
```

## Frontend
View the frontend [here](https://trustless-escrow.vercel.app).
Usage is pretty straight-forward.

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

## Solutions
### Building a Scalable Escrow Platform
Trustless can scale to n amount of escrows at a time, provided that there is only one escrow at a time with the same `user1` and `user2`. Trustless achieves this by distributing the responsibility of each seperate escrow to a new contract each time. This ensures that escrows cannot collide, as they all have seperate balances. The `TrustlessEscrow` contracts also are not locked to a certain amount of ERC20 token, so the terms of the escrow are fluid. This however is not possible with ERC721 tokens as we cannot assume that the token employs ERC721Enumerable, so it is limited to a single tokenId.
The only limitation is that the router uses the `user1` and `user2` values to store the contract addresses for each escrow, so unless you know the contract address for your escrow, users should refrain from creating multiple escrows between the same addresses.

### Decentralized Escrow Arbitration
Trustless' escrow arbitration is just that - trustless. Users have to treat their funds very carefully, as there is no override to the escrow. Trustless escrows must be 'confirmed' by both users before execution. This means that both users are happy to execute the escrow in the current state. Only once both parties have confirmed the escrow, it can be executed. If it is not executed by the escrows 'expiry time' it can be reversed by either user and everyone gets their tokens back.
