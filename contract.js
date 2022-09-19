async function loadContract(web3) {
	return await new web3.eth.Contract([
		{
			"inputs": [],
			"name": "addBalance",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint32",
					"name": "bet",
					"type": "uint32"
				}
			],
			"name": "doubleBet",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint32",
					"name": "bet",
					"type": "uint32"
				}
			],
			"name": "placeBet",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "betId",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "result",
							"type": "uint256"
						}
					],
					"internalType": "struct CoinFlip.Resolve[]",
					"name": "resolveArr",
					"type": "tuple[]"
				}
			],
			"name": "resolveBets",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_feesPercentage",
					"type": "uint256"
				}
			],
			"name": "setFeesPercentage",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_randomManager",
					"type": "address"
				}
			],
			"name": "setRandomManager",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "startGame",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "stopGame",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_win_reward",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_fees_percentage",
					"type": "uint256"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [],
			"name": "withdraw",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "withdrawFeesBalance",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "withdrawWinBalance",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "gameStatus",
			"outputs": [
				{
					"internalType": "enum CoinFlip.GameStatus",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getFeesBalance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getHistory",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "addr",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "bet",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "amount",
							"type": "uint256"
						},
						{
							"internalType": "enum CoinFlip.BetStatus",
							"name": "status",
							"type": "uint8"
						},
						{
							"internalType": "uint256",
							"name": "timestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct CoinFlip.Bet[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getHistoryByAddress",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "addr",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "bet",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "amount",
							"type": "uint256"
						},
						{
							"internalType": "enum CoinFlip.BetStatus",
							"name": "status",
							"type": "uint8"
						},
						{
							"internalType": "uint256",
							"name": "timestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct CoinFlip.Bet[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getLastBet",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "addr",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "bet",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "amount",
							"type": "uint256"
						},
						{
							"internalType": "enum CoinFlip.BetStatus",
							"name": "status",
							"type": "uint8"
						},
						{
							"internalType": "uint256",
							"name": "timestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct CoinFlip.Bet",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getPendingBets",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "addr",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "bet",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "amount",
							"type": "uint256"
						},
						{
							"internalType": "enum CoinFlip.BetStatus",
							"name": "status",
							"type": "uint8"
						},
						{
							"internalType": "uint256",
							"name": "timestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct CoinFlip.Bet[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getWinBalanceByAddress",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "maxBet",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	], "0xE2c7c8f73648C36544146017aaf44d2F4DD455A5");
  }