---
sidebar_position: 2
title: 'Verifying Starknet contracts on Walnut'
description: 'Smart Contract Verification involves uploading your source code to Walnut to debug it step by step.'
hide_title: true
---

# Verify Starknet Contracts on Walnut

To debug your contracts in Walnut and step through transactions at the source code level, start by verifying your contract classes by uploading your source code.

Once verified, you can use the Walnut Debugger to replay blockchain transactions and analyze their execution line by line.

:::info
Contract verification is available on **Mainnet**, **Sepolia**, and **custom networks**, making the Walnut Verification Service ready for the Starknet appchain future.
:::


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

```shell
sncast \
    verify \
    --contract-address 0x01e4ebe3278ab4633a9d0d3f5c4290001f29bc3179a70e570b6817dd7f8264fa \
    --contract-name SimpleBalance \
    --verifier walnut \
    --network sepolia
```

You can also use `--class-hash` instead of `--contract-address`:

```shell
sncast \
    verify \
    --class-hash 0x031966c9fe618bcee61d267750b9d46e3d71469e571e331f35f0ca26efe306dc \
    --contract-name SimpleBalance \
    --verifier walnut \
    --network sepolia
```

The `sncast verify` command accepts the following parameters:

| Parameter | Required | Values | Description |
|---|---|---|---|
| `contract-name` | ✓ | string | Module name after `mod` in your contract source file |
| `verifier` | ✓ | `walnut`, `voyager` | Verification provider |
| `network` | ✓ | `mainnet`, `sepolia` | Network where the contract is deployed |
| `contract-address` | ◐ | hex address | Mutually exclusive with `class-hash` |
| `class-hash` | ◐ | hex hash | Mutually exclusive with `contract-address` |

:::note Legend
**✓** Required &nbsp;&nbsp; **◐** One of these is required
:::

3. Confirm the code submission
If everything is correct, the command will start the verification process.
```shell
You are about to submit the entire workspace's code to the third-party chosen verifier at walnut, and the code will be publicly available through walnut's APIs. Are you sure? (Y/n):
```

Confirm the submission when prompted by pressing `Y`.

4. Upon successful verification, you'll receive a message with a verification status link similar to this:

```shell

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
```shell

sozo walnut verify

```

2. If everything is correct, verification process on Walnut will start. You should see a notification with a verification status link, similar to this:

```shell
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

```json title="Request JSON body"
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
**Request body fields:**

| Field | Required | Description |
|---|---|---|
| `contract_name` | ✓ | Module name after `mod` in your contract file |
| `contract_address` | ◐ | Address of the contract to verify. Required if `class_hash` is not provided |
| `class_hash` | ◐ | Hash of the class to verify. Required if `contract_address` is not provided |
| `source_code` | ✓ | JSON object mapping file paths to source code |

:::note Legend
**✓** Required &nbsp;&nbsp; **◐** One of these is required
:::

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

```json title="Request JSON body"
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
**Request body fields:**

| Field | Required | Description |
|---|---|---|
| `class_names` | ◐ | Array of contract names. Use for multiple classes |
| `class_hashes` | ◐ | Array of class hashes declared in the network. Use for multiple classes |
| `class_name` | ◐ | Single contract name (alternative to `class_names`) |
| `class_hash` | ◐ | Single class hash (alternative to `class_hashes`) |
| `rpc_url` | – | JSON-RPC endpoint of the custom network |
| `source_code` | ✓ | JSON object mapping file paths to source code |
| `cairo_version` | – | Cairo version. Defaults to the value in `Scarb.toml` |

:::note Legend
**✓** Required &nbsp;&nbsp; **◐** One of these is required &nbsp;&nbsp; **–** Optional
:::

**Possible Responses**:

- **200**: Contract verification started. Response body contains the string payload with a verification check status link (e.g. `"Contract verification has started. You can check the verification status at the following link: https://app.walnut.dev/verification/status/<UUID>"`).
- **400**: An error occurred during verification, such as a mismatch. Response error body payload contains the error message for diagnostics.