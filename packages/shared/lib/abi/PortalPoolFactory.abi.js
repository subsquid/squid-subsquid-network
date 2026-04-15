"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABI_JSON = void 0;
exports.ABI_JSON = [
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
        "name": "POOL_DEPLOYER_ROLE",
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
        "name": "UPGRADE_INTERFACE_VERSION",
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
        "name": "addPaymentToken",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "allPortals",
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
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "beacon",
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
        "name": "collectionDeadlineSeconds",
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
        "name": "createPortalPool",
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
                        "type": "string",
                        "name": "tokenSuffix"
                    },
                    {
                        "type": "uint256",
                        "name": "distributionRatePerSecond"
                    },
                    {
                        "type": "uint256",
                        "name": "initialDeposit"
                    },
                    {
                        "type": "string",
                        "name": "metadata"
                    },
                    {
                        "type": "address",
                        "name": "rewardToken"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "portal"
            }
        ]
    },
    {
        "type": "function",
        "name": "defaultMaxStakePerWallet",
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
        "name": "defaultWhitelistEnabled",
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
        "name": "exitUnlockRatePerSecond",
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
        "name": "feeRouter",
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
        "name": "getAllowedPaymentTokens",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address[]",
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
        "name": "getOperatorPortals",
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
                "type": "address[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getOperatorPortalsPaginated",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "operator"
            },
            {
                "type": "uint256",
                "name": "offset"
            },
            {
                "type": "uint256",
                "name": "limit"
            }
        ],
        "outputs": [
            {
                "type": "address[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getPortalCount",
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
        "name": "initialize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_implementation"
            },
            {
                "type": "address",
                "name": "_portalRegistry"
            },
            {
                "type": "address",
                "name": "_feeRouter"
            },
            {
                "type": "address",
                "name": "_sqd"
            },
            {
                "type": "uint256",
                "name": "_defaultMaxStakePerWallet"
            },
            {
                "type": "uint256",
                "name": "_minStakeThreshold"
            },
            {
                "type": "uint256",
                "name": "_workerEpochLength"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "isAllowedPaymentToken",
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
        "name": "isPortal",
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
        "name": "maxDistributionRatePerSecond",
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
        "name": "maxPaymentTokens",
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
        "name": "minDistributionRatePerSecond",
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
        "name": "minStakeThreshold",
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
        "name": "operatorPortalCount",
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
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "operatorPortalPools",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "uint256",
                "name": ""
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
        "name": "paymentTokensList",
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
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "poolDeploymentOpen",
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
        "name": "portalCount",
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
        "name": "portalRegistry",
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
        "name": "proxiableUUID",
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
        "name": "removePaymentToken",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
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
        "name": "setCollectionDeadline",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "seconds_"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setDefaultMaxStakePerWallet",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_maxStake"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setDefaultWhitelistEnabled",
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
        "name": "setExitUnlockRate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "ratePerSecond"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setFeeRouter",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_feeRouter"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaxDistributionRate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "ratePerSecond"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaxPaymentTokens",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "value"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMinDistributionRate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "ratePerSecond"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMinStakeThreshold",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_minStakeThreshold"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPoolDeploymentOpen",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bool",
                "name": "open"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWhitelistFeatureEnabled",
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
        "name": "setWorkerEpochLength",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_workerEpochLength"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "sqd",
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
        "name": "upgradeBeacon",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newImplementation"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "upgradeToAndCall",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "address",
                "name": "newImplementation"
            },
            {
                "type": "bytes",
                "name": "data"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "whitelistFeatureEnabled",
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
        "name": "workerEpochLength",
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
        "name": "BeaconUpgraded",
        "inputs": [
            {
                "type": "address",
                "name": "newImplementation",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollectionDeadlineUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DefaultMaxStakePerWalletUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "DefaultWhitelistEnabledUpdated",
        "inputs": [
            {
                "type": "bool",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ExitUnlockRateUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeeRouterUpdated",
        "inputs": [
            {
                "type": "address",
                "name": "oldValue",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newValue",
                "indexed": true
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
        "name": "MaxDistributionRateUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MaxPaymentTokensUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MinDistributionRateUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "MinStakeThresholdUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
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
        "name": "PaymentTokenAdded",
        "inputs": [
            {
                "type": "address",
                "name": "token",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PaymentTokenRemoved",
        "inputs": [
            {
                "type": "address",
                "name": "token",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PoolCreated",
        "inputs": [
            {
                "type": "address",
                "name": "portal",
                "indexed": true
            },
            {
                "type": "address",
                "name": "operator",
                "indexed": true
            },
            {
                "type": "address",
                "name": "rewardToken",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "capacity",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "distributionRatePerSecond",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "initialDeposit",
                "indexed": false
            },
            {
                "type": "string",
                "name": "tokenSuffix",
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
        "name": "PoolDeploymentOpenUpdated",
        "inputs": [
            {
                "type": "bool",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "newValue",
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
        "name": "Upgraded",
        "inputs": [
            {
                "type": "address",
                "name": "implementation",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WhitelistFeatureEnabledUpdated",
        "inputs": [
            {
                "type": "bool",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "bool",
                "name": "newValue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "WorkerEpochLengthUpdated",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldValue",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newValue",
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
        "name": "AddressEmptyCode",
        "inputs": [
            {
                "type": "address",
                "name": "target"
            }
        ]
    },
    {
        "type": "error",
        "name": "BelowMinimum",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ERC1967InvalidImplementation",
        "inputs": [
            {
                "type": "address",
                "name": "implementation"
            }
        ]
    },
    {
        "type": "error",
        "name": "ERC1967NonPayable",
        "inputs": []
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
        "name": "FailedCall",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InsufficientRewardPrecision",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidAddress",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidExitRate",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidInitialization",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotAuthorized",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotInitializing",
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
        "name": "TokenAlreadyAdded",
        "inputs": []
    },
    {
        "type": "error",
        "name": "TokenNotAllowed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "TooManyTokens",
        "inputs": []
    },
    {
        "type": "error",
        "name": "UUPSUnauthorizedCallContext",
        "inputs": []
    },
    {
        "type": "error",
        "name": "UUPSUnsupportedProxiableUUID",
        "inputs": [
            {
                "type": "bytes32",
                "name": "slot"
            }
        ]
    }
];
//# sourceMappingURL=PortalPoolFactory.abi.js.map