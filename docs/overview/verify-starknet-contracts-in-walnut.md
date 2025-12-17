---
sidebar_position: 2
title: 'Verifying Starknet contracts on Walnut'
description: 'Smart Contract Verification involves uploading your source code to Walnut to debug it step by step.'
hide_title: true
---

# Verify Starknet Contracts on Walnut

To debug your contracts in Walnut and step through transactions at the source code level, start by verifying your contract classes by uploading your source code.

Once verified, you can use the Walnut Debugger to replay blockchain transactions and analyze their execution line by line.

Info box: Contract verification is available on **Mainnet**, **Sepolia**, and **custom networks**, making the Walnut Verification Service ready for the Starknet appchain future.


## Verification methods
Walnut offers several ways to verify your contracts:

1. `sncast verify` – Use the [sncast](https://foundry-rs.github.io/starknet-foundry/starknet/sncast-overview.html) command-line tool to verify Foundry projects.
2. `sozo walnut verify` – Use the [sozo](https://book.dojoengine.org/toolchain/sozo) command-line tool to verify Dojo Worlds.
3. Walnut Verification API – Ideal for programmatic use cases.

## sncast verification

`sncast verify` command allows to verify your Foundry projects on Walnut.

To verify contracts deployed to Mainnet or Sepolia, follow these steps:

1. Ensure your project has a `Scarb.toml` file, and the contract is already deployed to the target network. For more contract deployment information refer to the [Starknet Foundry documentation](https://foundry-rs.github.io/starknet-foundry/starknet/deploy.html).
2. In the project folder execute the verification command:

```shell {{ title: 'shell' }}
sncast \
    verify \
    --contract-address 0x01e4ebe3278ab4633a9d0d3f5c4290001f29bc3179a70e570b6817dd7f8264fa \
    --contract-name SimpleBalance \
    --verifier walnut \
    --network sepolia
```

You can also use `--class-hash` instead of `--contract-address`:

```shell {{ title: 'shell' }}
sncast \
    verify \
    --class-hash 0x031966c9fe618bcee61d267750b9d46e3d71469e571e331f35f0ca26efe306dc \
    --contract-name SimpleBalance \
    --verifier walnut \
    --network sepolia
```

The `sncast verify` command requires the following parameters:
- `contract-name`: The name of the contract. The contract name is the part after the `mod` keyword in your contract source code file. (_Required Parameter_)
- `verifier`: The verification provider to use. Set to `walnut` to use Walnut verification service. (_Required Parameter_). Possible values are:
  - `walnut` - to verify contracts on Walnut
  - `voyager` - to verify contracts on Voyager
- `network`: Network where contract to be verified is deployed (_Required Parameter_). Possible values are:
  - `mainnet` - when you verify contracts deployed to Starknet Mainnet network
  - `sepolia` - when you verify contracts deployed Starknet Sepolia testnet network
- Either `contract-address` or `class-hash` (_Mutually Exclusive_):
  - `contract-address`: The address of the contract that is to be verified. (_Required if class-hash is not provided_)
  - `class-hash`: The class hash of the contract that is to be verified. (_Required if contract-address is not provided_)

3. Confirm the code submission
If everything is correct, the command will start the verification process.
```shell {{ title: 'shell' }}
You are about to submit the entire workspace's code to the third-party chosen verifier at walnut, and the code will be publicly available through walnut's APIs. Are you sure? (Y/n):
````
Confirm the submission when prompted by pressing `Y`.

4. Upon successful verification, you'll receive a message with a verification status link similar to this:

```shell {{ title: 'shell' }}

command: verify
message: "Contract verification has started. You can check the verification status at the following link: https://app.walnut.dev/verification/status/<uuid>"

```

5. Well done! You've successfully submitted your contracts verification request on Walnut. You can use a given link to check the status of your verification.
Once the verification is complete, you can debug transactions interacting with your contracts on Walnut.


## sozo verification

`sozo walnut verify` command allows to verify your Dojo contracts on Walnut. Before verifying, make sure your project can successfully build with the `sozo build` command.
For more details regarding dojo project build please refer to [Dojo&nbsp;documentation](https://book.dojoengine.org/toolchain/sozo).

Follow these steps to verify your contracts on Walnut using `sozo`:

1. Navigate to your dojo project and run:
```shell {{ title: 'shell' }}

sozo walnut verify

```

2. If everything is correct, verification process on Walnut will start. You should see a notification with a verification status link, similar to this:

```shell {{title: 'shell' }}
🌰 Verifying classes with Walnut...

  > "Contract verification has started. You can check the verification status at the following link: https://app.walnut.dev/verification/status/<uuid>"

```

3. That's all! Monitor your verification status with a given verification link.

## Walnut API verification

You can also verify your contracts using Walnut's API. This method currently supports 2 endpoints for contract verification: one for mainnet/sepolia and one for custom networks.

The base API URL for Walnut is: https://api.walnut.dev

### 1. Verify contracts on Mainnet/Sepolia

**Endpoint**: `POST /v1/{chain_id}/verify` - `chain_id` can be either `sn_mainnet` or `sn_sepolia`

- **Supported networks**: Mainnet, Sepolia Testnet
- **Headers required**: `application/json`
- **Request body**:

```json {{ title: 'Request JSON body' }}
{
  "contract_name": "SimpleBalance",
  "contract_address": "0x01e4ebe3278ab4633a9d0d3f5c4290001f29bc3179a70e570b6817dd7f8264fa", // This is optional to provide if the class_hash is not provided
  "class_hash": "0x031966c9fe618bcee61d267750b9d46e3d71469e571e331f35f0ca26efe306dc", // This is optional to provide if the contract_address is not provided
  "source_code": {
    "src/lib.cairo": "// your lib.cairo source code here",
    "src/utils/util1.cairo": "// your util1.cairo source code here",
    "Scarb.toml": "// your Scarb.toml code here"
  }
}
```
- **Request JSON body overview**:
- `contract_name`: The name of the contract. The contract name is the part after the `mod` keyword in your contract file. (_Required_)
- `contract_address`: The address of the contract that is to be verified. (_Optional_ if class hash is not provided)
- `class_hash`: The hash of the class that is to be verified. (_Optional_ if contract address is not provided)
- `source_code`: A JSON object containing the file paths as keys and the corresponding source code as values. (_Required_)

- **Responses**:

  - **200**: Contract verification started. Response body contains the string payload with a verification check status link (e.g. `"Contract verification has started. You can check the verification status at the following link: https://app.walnut.dev/verification/status/<UUID>"`).
  - **400**: An error occurred during verification, such as a mismatch. Response error body payload contains the error message for diagnostics.

### 2. Verify contracts on custom networks

Verification is supported on custom networks compatible with Starknet JSON-RPC version ≥0.6.0. For custom networks, Walnut stores verified class data without an associated chain ID, allowing reuse across networks where the class shares the same source code.

Verifying contracts on custom networks is only available through the Walnut Verification API.

- **Endpoint**: `POST /v1/verify`

- **Headers required**:

  - `x-api-key`: Your Walnut API key. Contact us to get an API key: [https://t.me/walnuthq](https://t.me/walnuthq).
  - `application/json`

- **Request body**:

```json {{ title: 'Request JSON body' }}
{
  "class_names": ["CustomClass1", "CustomClass2"],
  "class_hashes": ["0xabc123...", "0xabc124..."],
  "class_name": "CustomClass", // This is optional to provide if multiple class_names are not provided
  "class_hash": "0xabc123...", // This is optional to provide if multiple class_hashes are not provided
  "rpc_url": "https://custom-rpc.example.com",
  "source_code": {
    "src/lib.cairo": "// your lib.cairo source code here",
    "src/utils/util1.cairo": "// your util1.cairo source code here",
    "Scarb.toml": "// your Scarb.toml code here"
  },
  "cairo_version": "2.8.2"
}
```
- **Overview**:
  - `class_names`: The names of the contracts. (_Optional_ if the class name of single class is not provided)
  - `class_hashes`: The hash representing the declared class in the network. (_Optional_ is the class hash of single class is not provided)
  - `class_name`: The name of the contract. The contract name is the part after the mod keyword in your contract file. (_Optional_ if the multiple classes are not provided)
  - `class_hash`: The hash representing the declared class in the network. (_Optional_ if the multiple classes are not provided)
  - `rpc_url`: The endpoint of the network's JSON-RPC service. (_Optional_)
  - `source_code`: A JSON object containing the file paths as keys and the corresponding source code as values. (_Required_)
  - `cairo_version`: The version of Cairo being used. (_Optional_ if not provided, this value is extracted from the starknet field in your Scarb.toml file.)

**Possible Responses**:

- **200**: Contract verification started. Response body contains the string payload with a verification check status link (e.g. `"Contract verification has started. You can check the verification status at the following link: https://app.walnut.dev/verification/status/<UUID>"`).
- **400**: An error occurred during verification, such as a mismatch. Response error body payload contains the error message for diagnostics.