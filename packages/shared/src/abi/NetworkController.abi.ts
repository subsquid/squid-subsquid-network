export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "_epochLength"
            },
            {
                "type": "uint256",
                "name": "_bondAmount"
            },
            {
                "type": "address[]",
                "name": "_allowedVestedTargets"
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
        "name": "bondAmount",
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
        "name": "epochLength",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "epochNumber",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "firstEpochBlock",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
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
        "name": "isAllowedVestedTarget",
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
        "name": "nextEpoch",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
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
        "name": "setAllowedVestedTarget",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "target"
            },
            {
                "type": "bool",
                "name": "isAllowed"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setBondAmount",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_bondAmount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setEpochLength",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "_epochLength"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setStakingDeadlock",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_newDeadlock"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setStoragePerWorkerInGb",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint128",
                "name": "_storagePerWorkerInGb"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setTargetCapacity",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "target"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setYearlyRewardCapCoefficient",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "coefficient"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "stakingDeadlock",
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
        "name": "storagePerWorkerInGb",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint128",
                "name": ""
            }
        ]
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
        "name": "targetCapacityGb",
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
        "name": "yearlyRewardCapCoefficient",
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
        "name": "AllowedVestedTargetUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "target",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "isAllowed",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "BondAmountUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "bondAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "EpochLengthUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "epochLength",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RewardCoefficientUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "coefficient",
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
        "name": "StakingDeadlockUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "stakingDeadlock",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StoragePerWorkerInGbUpdated",
        "inputs": [
            {
                "type": "uint128",
                "name": "storagePerWorkerInGb",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TargetCapacityUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "target",
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
    }
]
