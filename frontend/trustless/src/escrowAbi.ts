export default [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_user2",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_user1Address",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_user2Address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "interval",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "cancel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "confirm",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "confirmations",
      "outputs": [
        {
          "internalType": "bytes2",
          "name": "",
          "type": "bytes2"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "execute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];