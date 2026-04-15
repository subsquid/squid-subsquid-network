export declare const ABI_JSON: ({
    type: string;
    stateMutability: string;
    payable: boolean;
    inputs: {
        type: string;
        name: string;
    }[];
    name?: undefined;
    constant?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    constant: boolean;
    payable: boolean;
    inputs: {
        type: string;
        name: string;
    }[];
    outputs: {
        type: string;
        name: string;
    }[];
    stateMutability?: undefined;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    constant: boolean;
    stateMutability: string;
    payable: boolean;
    inputs: {
        type: string;
        name: string;
    }[];
    outputs: {
        type: string;
        name: string;
    }[];
    anonymous?: undefined;
} | {
    type: string;
    anonymous: boolean;
    name: string;
    inputs: {
        type: string;
        name: string;
        indexed: boolean;
    }[];
    stateMutability?: undefined;
    payable?: undefined;
    constant?: undefined;
    outputs?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        type: string;
        name: string;
    }[];
    stateMutability?: undefined;
    payable?: undefined;
    constant?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
})[];
