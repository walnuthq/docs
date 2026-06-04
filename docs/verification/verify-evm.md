---
sidebar_position: 2
title: "Verify EVM Contracts"
description: "Verify your EVM Smart Contracts using Walnut Verification UI."
hide_title: true
---

# Verify EVM Contracts

To step through transactions at the source code level in Walnut, log in to the Walnut EVM Debugger and verify your contracts on the [verification UI](https://verify.walnut.dev).

Once verified, you can replay blockchain transactions and analyze execution line by line.

:::tip
Contract verification is available on **OP Mainnet**, **OP Sepolia**, and **custom networks**. [Contact us](https://t.me/walnuthq) to request support for additional public networks or to add your own private networks.
:::

## Verification Modes

Walnut offers two modes for smart contract verification:

- Public verification: Log in with a GitHub account and verify contracts publicly on any chain supported by Walnut. Verified contracts are available on the [Contract Viewer repo](https://repo.walnut.dev).
- Private verification: Log in with a GitHub account and verify your contracts privately on custom networks. Only users within your organization can access privately verified contracts.

![Verification modes](/img/verify-evm-contracts-in-walnut/verification-modes.png "Click on the switch to toggle between private verification and public verification.")

## Verification Parameters

First, select the EVM chain where your contract is deployed and provide the contract address and language.

![Verification parameters](/img/verify-evm-contracts-in-walnut/verification-parameters.png "After pasting your contract address in the form input, the verification UI will automatically detect if it's been verified on the currently selected chain or any other chain.")

## Verification Methods

The verification UI offers several ways to verify your contracts:

1. Standard JSON Input (recommended) - Upload a file using standard JSON input format.
2. Source code upload - Upload your project source code using file uploads.
3. Foundry: Verify contracts on the command line with Foundry. [Contact us](https://t.me/walnuthq) if you'd like to enable this workflow.

![Verification methods](/img/verify-evm-contracts-in-walnut/verification-methods.png "Standard JSON input is the easiest way to verify your contract, simply drop your standard-json-input.json in the file input.")

Use Foundry's forge to generate the Standard JSON input using this command:

```sh
forge verify-contract --show-standard-json-input 0x5059c7F4e62Ce813f79c1F59f3924DDc6347Ce31 \
    src/Counter.sol:Counter > standard-json-input.json
```

## Verification Settings

Choose the compiler version your contract was compiled with, provide the contract identifier, and click Verify Contract.

![Verification settings](/img/verify-evm-contracts-in-walnut/verification-settings.png "If your chain has no explorer configured you can optionally specify the creation transaction hash.")

## Verification Submitted

After submitting, our Sourcify server will start the verification. It will recompile your contract sources and compare the resulting bytecode against the on-chain deployed bytecode.

Click View Job Status to monitor the verification process.

![Verification submitted](/img/verify-evm-contracts-in-walnut/verification-submitted.png "You can access a list of the recent verifications you submitted directly in the verification UI.")

## View Job Status

When logged in, click View in Repository on the job status page to find your verified contract in the [Contract Viewer repo](https://repo.walnut.dev).

![View job status](/img/verify-evm-contracts-in-walnut/view-job-status.png "The job status page gives you additional info on the verification process.")

## Verified Contract Repository

To find your verified contracts at any time, log in to the Walnut EVM Debugger and open the [Contract Viewer repo](https://repo.walnut.dev). Select the chain ID and your verified contract address.

![Verified contract repository](/img/verify-evm-contracts-in-walnut/verified-contract-repository.png "The verified contract repo gives you access to source code, ABI, bytecode, etc…")
