export default [
  {
    type: "function",
    stateMutability: "payable",
    outputs: [],
    name: "create20",
    inputs: [
      { type: "address", name: "user1", internalType: "address" },
      { type: "address", name: "user2", internalType: "address" },
      { type: "address", name: "token1", internalType: "address" },
      { type: "address", name: "token2", internalType: "address" },
      { type: "uint256", name: "time", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "payable",
    outputs: [],
    name: "create721",
    inputs: [
      { type: "address", name: "user1", internalType: "address" },
      { type: "address", name: "user2", internalType: "address" },
      { type: "address", name: "token1", internalType: "address" },
      { type: "address", name: "token2", internalType: "address" },
      { type: "uint256", name: "tokenId1", internalType: "uint256" },
      { type: "uint256", name: "tokenId2", internalType: "uint256" },
      { type: "uint256", name: "time", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "payable",
    outputs: [],
    name: "createHybrid",
    inputs: [
      { type: "address", name: "user1", internalType: "address" },
      { type: "address", name: "user2", internalType: "address" },
      { type: "address", name: "token1", internalType: "address" },
      { type: "address", name: "token2", internalType: "address" },
      { type: "uint256", name: "tokenId", internalType: "uint256" },
      { type: "uint256", name: "time", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "escrows",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
];
