export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": []
    },
    {
        "type": "function",
        "name": "ACC",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "DEFAULT_ADMIN_ROLE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "FACTORY_ROLE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "OPERATOR_ROLE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "PRECISION",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "RATE_PRECISION",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "addToWhitelist",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "users"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "balanceTs",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint64",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "burnAddress",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "checkAndFailPortal",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "claimRewards",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "claimRewardsFromClosed",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "closePool",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "credit",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "currentBalance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "timestamp"
            }
        ],
        "outputs": [
            {
                "type": "int256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "debt",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "deposit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "emergencyWithdraw",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getActiveStake",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getClaimableRewards",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "provider"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getComputationUnits",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getCredit",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getCurrentRewardBalance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "int256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getDebt",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getExitTicket",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "provider"
            },
            {
                "type": "uint256",
                "name": "ticketId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "uint256",
                        "name": "endPosition"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    },
                    {
                        "type": "bool",
                        "name": "withdrawn"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getMetadata",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMinCapacity",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolInfo",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "address",
                        "name": "operator"
                    },
                    {
                        "type": "uint256",
                        "name": "capacity"
                    },
                    {
                        "type": "uint256",
                        "name": "totalStaked"
                    },
                    {
                        "type": "uint64",
                        "name": "depositDeadline"
                    },
                    {
                        "type": "uint64",
                        "name": "activationTime"
                    },
                    {
                        "type": "uint8",
                        "name": "state"
                    },
                    {
                        "type": "bool",
                        "name": "paused"
                    },
                    {
                        "type": "bool",
                        "name": "firstActivated"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getPoolStatusWithRewards",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "provider"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "poolCredit"
            },
            {
                "type": "uint256",
                "name": "poolDebt"
            },
            {
                "type": "int256",
                "name": "poolBalance"
            },
            {
                "type": "int256",
                "name": "runway"
            },
            {
                "type": "bool",
                "name": "outOfMoney"
            },
            {
                "type": "uint256",
                "name": "providerRewards"
            },
            {
                "type": "uint256",
                "name": "providerStake"
            }
        ]
    },
    {
        "type": "function",
        "name": "getProviderStake",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "provider"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getQueueStatus",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "provider"
            },
            {
                "type": "uint256",
                "name": "ticketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "processed"
            },
            {
                "type": "uint256",
                "name": "providerEndPos"
            },
            {
                "type": "uint256",
                "name": "secondsRemaining"
            },
            {
                "type": "bool",
                "name": "ready"
            }
        ]
    },
    {
        "type": "function",
        "name": "getQueueStatusWithTimestamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "provider"
            },
            {
                "type": "uint256",
                "name": "ticketId"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "processed"
            },
            {
                "type": "uint256",
                "name": "providerEndPos"
            },
            {
                "type": "uint256",
                "name": "secondsRemaining"
            },
            {
                "type": "bool",
                "name": "ready"
            },
            {
                "type": "uint256",
                "name": "unlockTimestamp"
            }
        ]
    },
    {
        "type": "function",
        "name": "getRewardStatus",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "int256",
                "name": "balance"
            },
            {
                "type": "uint256",
                "name": "currentDebt"
            },
            {
                "type": "int256",
                "name": "runwayTimestamp"
            },
            {
                "type": "bool",
                "name": "isDry"
            }
        ]
    },
    {
        "type": "function",
        "name": "getRewardToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getRoleAdmin",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getRunway",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "int256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getState",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint8",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getTicketCount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "provider"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getTotalDrainRate",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getTotalProcessed",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getWithdrawalWaitingTimestamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "unlockTimestamp"
            }
        ]
    },
    {
        "type": "function",
        "name": "grantRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "hasRole",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "tuple",
                "name": "params",
                "components": [
                    {
                        "type": "address",
                        "name": "operator"
                    },
                    {
                        "type": "uint256",
                        "name": "capacity"
                    },
                    {
                        "type": "uint256",
                        "name": "depositDeadline"
                    },
                    {
                        "type": "string",
                        "name": "tokenSuffix"
                    },
                    {
                        "type": "address",
                        "name": "sqd"
                    },
                    {
                        "type": "address",
                        "name": "rewardToken"
                    },
                    {
                        "type": "address",
                        "name": "portalRegistry"
                    },
                    {
                        "type": "address",
                        "name": "feeRouter"
                    },
                    {
                        "type": "uint256",
                        "name": "minStakeThreshold"
                    },
                    {
                        "type": "uint256",
                        "name": "distributionRatePerSecond"
                    },
                    {
                        "type": "string",
                        "name": "metadata"
                    }
                ]
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "initializeCredit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "isOutOfMoney",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "isWhitelisted",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "user"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "lastEffectiveRewardTs",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint64",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "lptToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "multicall",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes[]",
                "name": "data"
            }
        ],
        "outputs": [
            {
                "type": "bytes[]",
                "name": "results"
            }
        ]
    },
    {
        "type": "function",
        "name": "onLPTTransfer",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "from"
            },
            {
                "type": "address",
                "name": "to"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "pause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "paused",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "perStakeRateWad",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "providerRatePerSec",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "recoverRewardsFromFailed",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "removeFromWhitelist",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address[]",
                "name": "users"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "renounceRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "callerConfirmation"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "requestExit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "ticketId"
            }
        ]
    },
    {
        "type": "function",
        "name": "revokeRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "rewardPerStakeStored",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "setCapacity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newCapacity"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setDistributionRate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newRatePerSecond"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWhitelistEnabled",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bool",
                "name": "enabled"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes4",
                "name": "interfaceId"
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "topUpRewards",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "totalDistributionRatePerSec",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "treasuryAccumulated",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "treasuryRatePerSec",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "tryMulticall",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes[]",
                "name": "data"
            }
        ],
        "outputs": [
            {
                "type": "bool[]",
                "name": "successes"
            },
            {
                "type": "bytes[]",
                "name": "results"
            }
        ]
    },
    {
        "type": "function",
        "name": "unpause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "whitelist",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "whitelistEnabled",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "withdrawExit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "ticketId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawFromFailed",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "workerPoolAddress",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CapacityUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldCapacity",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newCapacity",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Deposited",
        "inputs": [
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newTotal",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DistributionRateChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldRate",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newRate",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ExitClaimed",
        "inputs": [
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ExitRequested",
        "inputs": [
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "endPosition",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Initialized",
        "inputs": [
            {
                "type": "uint64",
                "name": "version",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Paused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolClosed",
        "inputs": [
            {
                "type": "address",
                "name": "closedBy",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "timestamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardsClaimed",
        "inputs": [
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardsRecovered",
        "inputs": [
            {
                "type": "address",
                "name": "operator",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardsToppedUp",
        "inputs": [
            {
                "type": "address",
                "name": "operator",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "received",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "toProviders",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "toWorkerPool",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "toBurn",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleAdminChanged",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "previousAdminRole",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "newAdminRole",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleGranted",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleRevoked",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StakeTransferred",
        "inputs": [
            {
                "type": "address",
                "name": "from",
                "indexed": true
            },
            {
                "type": "address",
                "name": "to",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StateChanged",
        "inputs": [
            {
                "type": "uint8",
                "name": "oldState",
                "indexed": false
            },
            {
                "type": "uint8",
                "name": "newState",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unpaused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WhitelistEnabledChanged",
        "inputs": [
            {
                "type": "bool",
                "name": "enabled",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WhitelistUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "bool",
                "name": "added",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Withdrawn",
        "inputs": [
            {
                "type": "address",
                "name": "provider",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "error",
        "name": "AccessControlBadConfirmation",
        "inputs": []
    },
    {
        "type": "error",
        "name": "AccessControlUnauthorizedAccount",
        "inputs": [
            {
                "type": "address",
                "name": "account"
            },
            {
                "type": "bytes32",
                "name": "neededRole"
            }
        ]
    },
    {
        "type": "error",
        "name": "AlreadyInitialized",
        "inputs": []
    },
    {
        "type": "error",
        "name": "AlreadyWithdrawn",
        "inputs": []
    },
    {
        "type": "error",
        "name": "BelowCurrentStake",
        "inputs": []
    },
    {
        "type": "error",
        "name": "BelowMinimum",
        "inputs": []
    },
    {
        "type": "error",
        "name": "CapacityExceeded",
        "inputs": []
    },
    {
        "type": "error",
        "name": "DeadlineNotPassed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "DistributionTurnedOff",
        "inputs": []
    },
    {
        "type": "error",
        "name": "EnforcedPause",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ExceedsWalletLimit",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ExpectedPause",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientRewardPrecision",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientStake",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientTransferableStake",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidAddress",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidAmount",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidDecimals",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidInitialization",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidState",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoActiveExitRequest",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoChange",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoStakeToWithdraw",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotActivated",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotAdmin",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotFactory",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotLPTToken",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotOperator",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotWhitelisted",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NothingToClaim",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolClosed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolHasDebt",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolNotClosed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PoolNotFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "RateBelowMinimum",
        "inputs": []
    },
    {
        "type": "error",
        "name": "RateExceedsMaximum",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ReentrancyGuardReentrantCall",
        "inputs": []
    },
    {
        "type": "error",
        "name": "SafeERC20FailedOperation",
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ]
    },
    {
        "type": "error",
        "name": "StillInQueue",
        "inputs": []
    },
    {
        "type": "error",
        "name": "UseWithdrawFromFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "WaitForActivationOrDeadline",
        "inputs": []
    },
    {
        "type": "error",
        "name": "WhitelistFeatureDisabled",
        "inputs": []
    }
]
