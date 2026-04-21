export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_router"
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
        "name": "PAUSER_ROLE",
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
        "name": "REWARDS_DISTRIBUTOR_ROLE",
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
        "name": "REWARDS_TREASURY_ROLE",
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
        "name": "addDistributor",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "distributor"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "alreadyApproved",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "commitment"
            },
            {
                "type": "address",
                "name": "distributor"
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
        "name": "approve",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "fromBlock"
            },
            {
                "type": "uint256",
                "name": "toBlock"
            },
            {
                "type": "uint256[]",
                "name": "recipients"
            },
            {
                "type": "uint256[]",
                "name": "workerRewards"
            },
            {
                "type": "uint256[]",
                "name": "_stakerRewards"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "approves",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "fromBlock"
            },
            {
                "type": "uint256",
                "name": "toBlock"
            }
        ],
        "outputs": [
            {
                "type": "uint8",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "canApprove",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "who"
            },
            {
                "type": "uint256",
                "name": "fromBlock"
            },
            {
                "type": "uint256",
                "name": "toBlock"
            },
            {
                "type": "uint256[]",
                "name": "recipients"
            },
            {
                "type": "uint256[]",
                "name": "workerRewards"
            },
            {
                "type": "uint256[]",
                "name": "_stakerRewards"
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
        "name": "canCommit",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "who"
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
        "name": "claim",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "who"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "claimedAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "claimable",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "who"
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
        "name": "commit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "fromBlock"
            },
            {
                "type": "uint256",
                "name": "toBlock"
            },
            {
                "type": "uint256[]",
                "name": "recipients"
            },
            {
                "type": "uint256[]",
                "name": "workerRewards"
            },
            {
                "type": "uint256[]",
                "name": "_stakerRewards"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "commitments",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "fromBlock"
            },
            {
                "type": "uint256",
                "name": "toBlock"
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
        "name": "lastBlockRewarded",
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
        "name": "removeDistributor",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "distributor"
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
        "name": "requiredApproves",
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
        "name": "roundRobinBlocks",
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
        "name": "router",
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
        "name": "setApprovesRequired",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_approvesRequired"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setRoundRobinBlocks",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_roundRobinBlocks"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWindowSize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_windowSize"
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
        "name": "unpause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "windowSize",
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
        "type": "event",
        "anonymous": false,
        "name": "Approved",
        "inputs": [
            {
                "type": "address",
                "name": "who",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "fromBlock",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "toBlock",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "commitment",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ApprovesRequiredChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "newApprovesRequired",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Claimed",
        "inputs": [
            {
                "type": "address",
                "name": "by",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "worker",
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
        "name": "Distributed",
        "inputs": [
            {
                "type": "uint256",
                "name": "fromBlock",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "toBlock",
                "indexed": false
            },
            {
                "type": "uint256[]",
                "name": "recipients"
            },
            {
                "type": "uint256[]",
                "name": "workerRewards"
            },
            {
                "type": "uint256[]",
                "name": "stakerRewards"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DistributorAdded",
        "inputs": [
            {
                "type": "address",
                "name": "distributor",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DistributorRemoved",
        "inputs": [
            {
                "type": "address",
                "name": "distributor",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewCommitment",
        "inputs": [
            {
                "type": "address",
                "name": "who",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "fromBlock",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "toBlock",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "commitment",
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
        "name": "RoundRobinBlocksChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "newRoundRobinBlocks",
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
        "name": "WindowSizeChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "newWindowSize",
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
        "name": "EnforcedPause",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ExpectedPause",
        "inputs": []
    }
]
