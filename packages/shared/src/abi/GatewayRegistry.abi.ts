export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": []
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
        "name": "addStake",
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
        "name": "allocateComputationUnits",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256[]",
                "name": "workerIds"
            },
            {
                "type": "uint256[]",
                "name": "cus"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "averageBlockTime",
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
        "name": "canUnstake",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "operator"
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
        "name": "computationUnitsAmount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint256",
                "name": "durationBlocks"
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
        "name": "computationUnitsAvailable",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
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
        "name": "defaultStrategy",
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
        "name": "disableAutoExtension",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "enableAutoExtension",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "gatewayByAddress",
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
                "type": "bytes32",
                "name": "gatewayId"
            }
        ]
    },
    {
        "type": "function",
        "name": "getActiveGateways",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "pageNumber"
            },
            {
                "type": "uint256",
                "name": "perPage"
            }
        ],
        "outputs": [
            {
                "type": "bytes[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getActiveGatewaysCount",
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
        "name": "getCluster",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            }
        ],
        "outputs": [
            {
                "type": "bytes[]",
                "name": "clusterPeerIds"
            }
        ]
    },
    {
        "type": "function",
        "name": "getGateway",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            }
        ],
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
                        "type": "address",
                        "name": "ownAddress"
                    },
                    {
                        "type": "bytes",
                        "name": "peerId"
                    },
                    {
                        "type": "string",
                        "name": "metadata"
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
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getMyGateways",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "operator"
            }
        ],
        "outputs": [
            {
                "type": "bytes[]",
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
        "name": "getStake",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "operator"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "uint256",
                        "name": "amount"
                    },
                    {
                        "type": "uint128",
                        "name": "lockStart"
                    },
                    {
                        "type": "uint128",
                        "name": "lockEnd"
                    },
                    {
                        "type": "uint128",
                        "name": "duration"
                    },
                    {
                        "type": "bool",
                        "name": "autoExtension"
                    },
                    {
                        "type": "uint256",
                        "name": "oldCUs"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getUsedStrategy",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            }
        ],
        "outputs": [
            {
                "type": "address",
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
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_token"
            },
            {
                "type": "address",
                "name": "_router"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "isStrategyAllowed",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "strategy"
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
        "name": "mana",
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
        "name": "maxGatewaysPerCluster",
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
        "name": "minStake",
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
        "name": "register",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "register",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            },
            {
                "type": "string",
                "name": "metadata"
            },
            {
                "type": "address",
                "name": "gatewayAddress"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "register",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            },
            {
                "type": "string",
                "name": "metadata"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "register",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes[]",
                "name": "peerId"
            },
            {
                "type": "string[]",
                "name": "metadata"
            },
            {
                "type": "address[]",
                "name": "gatewayAddress"
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
        "name": "setAverageBlockTime",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_newAverageBlockTime"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setGatewayAddress",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            },
            {
                "type": "address",
                "name": "newAddress"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setIsStrategyAllowed",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "strategy"
            },
            {
                "type": "bool",
                "name": "isAllowed"
            },
            {
                "type": "bool",
                "name": "isDefault"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMana",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_newMana"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaxGatewaysPerCluster",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_maxGatewaysPerCluster"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMetadata",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            },
            {
                "type": "string",
                "name": "metadata"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMinStake",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_minStake"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "stake",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint128",
                "name": "durationBlocks"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "stake",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint128",
                "name": "durationBlocks"
            },
            {
                "type": "bool",
                "name": "withAutoExtension"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "staked",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "operator"
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
        "name": "token",
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
        "name": "unpause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unregister",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "peerId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unregister",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes[]",
                "name": "peerId"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unstake",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "useStrategy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "strategy"
            }
        ],
        "outputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AllocatedCUs",
        "inputs": [
            {
                "type": "address",
                "name": "gateway",
                "indexed": true
            },
            {
                "type": "bytes",
                "name": "peerId",
                "indexed": false
            },
            {
                "type": "uint256[]",
                "name": "workerIds"
            },
            {
                "type": "uint256[]",
                "name": "shares"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AutoextensionDisabled",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
                "indexed": true
            },
            {
                "type": "uint128",
                "name": "lockEnd",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AutoextensionEnabled",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AverageBlockTimeChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "newBlockTime",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DefaultStrategyChanged",
        "inputs": [
            {
                "type": "address",
                "name": "strategy",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "GatewayAddressChanged",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
                "indexed": true
            },
            {
                "type": "bytes",
                "name": "peerId",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newAddress",
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
        "name": "ManaChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "newCuPerSQD",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MaxGatewaysPerClusterChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "newAmount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MetadataChanged",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
                "indexed": true
            },
            {
                "type": "bytes",
                "name": "peerId",
                "indexed": false
            },
            {
                "type": "string",
                "name": "metadata",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MinStakeChanged",
        "inputs": [
            {
                "type": "uint256",
                "name": "newAmount",
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
        "name": "Registered",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "id",
                "indexed": true
            },
            {
                "type": "bytes",
                "name": "peerId",
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
        "name": "Staked",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint128",
                "name": "lockStart",
                "indexed": false
            },
            {
                "type": "uint128",
                "name": "lockEnd",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "computationUnits",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "StrategyAllowed",
        "inputs": [
            {
                "type": "address",
                "name": "strategy",
                "indexed": true
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
        "name": "Unregistered",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
                "indexed": true
            },
            {
                "type": "bytes",
                "name": "peerId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unstaked",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
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
        "name": "UsedStrategyChanged",
        "inputs": [
            {
                "type": "address",
                "name": "gatewayOperator",
                "indexed": true
            },
            {
                "type": "address",
                "name": "strategy",
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
    },
    {
        "type": "error",
        "name": "InvalidInitialization",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
        "inputs": []
    }
]
