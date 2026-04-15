export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_SQD"
            },
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
        "name": "SQD",
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
        "name": "deregister",
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
        "name": "getActiveWorkerCount",
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
        "name": "getActiveWorkerIds",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getActiveWorkers",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple[]",
                "name": "",
                "components": [
                    {
                        "type": "address",
                        "name": "creator"
                    },
                    {
                        "type": "bytes",
                        "name": "peerId"
                    },
                    {
                        "type": "uint256",
                        "name": "bond"
                    },
                    {
                        "type": "uint128",
                        "name": "registeredAt"
                    },
                    {
                        "type": "uint128",
                        "name": "deregisteredAt"
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
        "name": "getAllWorkersCount",
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
        "name": "getOwnedWorkers",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "owner"
            }
        ],
        "outputs": [
            {
                "type": "uint256[]",
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
        "name": "getWorker",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "workerId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "address",
                        "name": "creator"
                    },
                    {
                        "type": "bytes",
                        "name": "peerId"
                    },
                    {
                        "type": "uint256",
                        "name": "bond"
                    },
                    {
                        "type": "uint128",
                        "name": "registeredAt"
                    },
                    {
                        "type": "uint128",
                        "name": "deregisteredAt"
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
        "name": "isWorkerActive",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "workerId"
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
        "name": "lockPeriod",
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
        "name": "nextWorkerId",
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
        "name": "returnExcessiveBond",
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
        "name": "updateMetadata",
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
        "name": "withdraw",
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
        "name": "workerIds",
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
                "name": "id"
            }
        ]
    },
    {
        "type": "function",
        "name": "workers",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "creator"
            },
            {
                "type": "bytes",
                "name": "peerId"
            },
            {
                "type": "uint256",
                "name": "bond"
            },
            {
                "type": "uint128",
                "name": "registeredAt"
            },
            {
                "type": "uint128",
                "name": "deregisteredAt"
            },
            {
                "type": "string",
                "name": "metadata"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ExcessiveBondReturned",
        "inputs": [
            {
                "type": "uint256",
                "name": "workerId",
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
        "name": "MetadataUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "workerId",
                "indexed": true
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
        "name": "WorkerDeregistered",
        "inputs": [
            {
                "type": "uint256",
                "name": "workerId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "deregistedAt",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WorkerRegistered",
        "inputs": [
            {
                "type": "uint256",
                "name": "workerId",
                "indexed": true
            },
            {
                "type": "bytes",
                "name": "peerId",
                "indexed": false
            },
            {
                "type": "address",
                "name": "registrar",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "registeredAt",
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
        "name": "WorkerWithdrawn",
        "inputs": [
            {
                "type": "uint256",
                "name": "workerId",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": true
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
