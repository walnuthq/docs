---
sidebar_position: 1
title: 'Overview'
description:
    'Overview of Transaction Simulations on Starknet using Walnut'
hide_title: true
---

# Overview

Transaction simulations let you understand what a transaction will do—without actually executing it on-chain. They provide a way to preview how a transaction interacts with smart contracts and how it affects blockchain state, all without touching the real network.

## Why Simulations Matter

Simulations help test, debug, and verify transaction behavior. They help catch security issues, edge cases, and logic errors before deployment, so you know what the transaction will actually do.

## Simulations vs. Re-Simulations

-	**Simulation**: Create a brand-new transaction with custom parameters and preview the result without sending anything on-chain.
-	**Re-Simulation**: Replay an existing on-chain transaction, optionally tweak its parameters, and see how different outcomes might unfold.

## Walnut Simulation Page

Walnut's Simulation page lets you configure a transaction simulation. Here's what each field does:

![Screenshot of the Simulation Form Page on Walnut](/img/simulation/simulation_page.png "Screenshot of the Simulation Form Page on Walnut")


Form Breakdown:

- **Network** - The network to simulate on, like Mainnet, Sepolia, or a custom network, which is often useful for appchains.
- **Sender address** - Test how a transaction behaves when sent from any address. No private keys are required for simulations.
- **Number of contract calls** - The number of contract calls the simulation will execute. For each call, you'll specify:
  - **Contract address** - Address of the contract being called.
  - **Entrypoint** - The function to call from the contract. Available options are auto-populated from the contract's ABI.
  - **Calldata** - Data passed to the entrypoint, formatted according to Cairo serialization. For more details, see [Serialization of Cairo Types](https://www.starknet.io/cairo-book/ch102-04-serialization-of-cairo-types.html).
- **Block number** - Block number to simulate against. Leave blank for the latest block.
- **Transaction version** - In most cases, just use 3. For more details, refer to the official [**Starknet documentation**](https://docs.starknet.io/learn/protocol/transactions).

:::tip
For a step-by-step guide, see [Simulate New Transactions](simulate-new) or [Re-simulate Existing Transactions](resimulate-existing).
:::
