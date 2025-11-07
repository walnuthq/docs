---
sidebar_position: 1
title: "Verifying EVM contracts on Walnut"
description: "Verify your EVM Smart Contracts using Walnut Verification UI."
hide_title: true
---

# Verify EVM Contracts on Walnut

To debug your contracts in Walnut and step through transactions at the source code level, start by verifying your contracts on our [verification UI](https://verify.walnut.dev).

Once verified, you can use the Walnut Debugger to replay blockchain transactions and analyze their execution line by line.

:::tip
Contract verification is available on **OP Mainnet**, **OP Sepolia**, and **custom networks**, please [contact us](https://t.me/walnuthq) to request support for additional public networks or add your own private networks.
:::

## Verification modes

Walnut offers 2 different modes for Smart Contracts verification:

- Public verification: Verify your contracts publicly on any chain supported by Walnut, you will only need to be authenticated via Github. Your verified contracts will be publicly available on our [Contract Viewer repo](https://repo.walnut.dev).
- Private verification: Verify your contracts privately on your configured custom networks, only users within your organization will be able to access these privately verified contracts.

![Verification modes](/img/verify-evm-contracts-in-walnut/verification-modes.png "Click on the switch to toggle between private verification and public verification.")

## Verification parameters

The first step to verify your contract is to select the EVM chain where it is deployed as well as the contract address and language.

![Verification parameters](/img/verify-evm-contracts-in-walnut/verification-parameters.png "After pasting your contract address in the form input, the verification UI will automatically detect if it's been verified on the currently selected chain or any other chain.")

## Verification methods

Our verification UI offers several ways to verify your contracts:

1. Standard JSON Input (recommended) - Upload a file using standard JSON input format.
2. Source code upload - Upload your project source code using file uploads.
3. Foundry: It is also possible to verify your contracts on the command line using Founrdry, [contact us](https://t.me/walnuthq) if you'd like to enable this workflow.

![Verification methods](/img/verify-evm-contracts-in-walnut/verification-methods.png "Standard JSON input is the easiest way to verify your contract, simply drop your standard-json-input.json in the file input.")

Using Foundry's forge, you can get the Standard JSON input using this command:

```sh
forge verify-contract --show-standard-json-input 0x5059c7F4e62Ce813f79c1F59f3924DDc6347Ce31 \
    src/Counter.sol:Counter > standard-json-input.json
```

## Verification settings

Finally, choose the compiler version your contract was compiled with and the contract identifier and click on the Verify Contract button.

![Verification settings](/img/verify-evm-contracts-in-walnut/verification-settings.png "If your chain has no explorer configured you can optionally specify the creation transaction hash.")

## Verification submitted

After your verification is submitted, our Sourcify server will trigger the verification process which involves recompiling your contract sources and comparing the resulting bytecode with on-chain deployed bytecode.

Click on the View Job Status button to monitor the verification process.

![Verification submitted](/img/verify-evm-contracts-in-walnut/verification-submitted.png "You can access a list of the recent verifications you submitted directly in the verification UI.")

## View Job Status

On the job status page, you'll get access to your verified contract in our [Contract Viewer repo](https://repo.walnut.dev) by clicking on the View in Repository button.

![View job status](/img/verify-evm-contracts-in-walnut/view-job-status.png "The job status page gives you additional info on the verification process.")

## Verified Contract Repository

You can find your verified contracts in our [Contract Viewer repo](https://repo.walnut.dev) anytime by selecting the appropriate chain ID and your verified contract address.

![Verified contract repository](/img/verify-evm-contracts-in-walnut/verified-contract-repository.png "The verified contract repo gives you access to source code, ABI, bytecode, etc…")
