---
sidebar_position: 1
title: 'Introduction to Transaction Simulations'
description:
    'Introduction and overview of Transaction Simulations on Starknet using Walnut'
hide_title: true
---

# Introduction

Transaction simulations let you understand what a transaction will do—without actually executing it on-chain. They provide a way to preview how a transaction interacts with smart contracts and how it affects blockchain state, all without touching the real network.

## Why Simulations Matter?

Simulations are essential for testing, debugging, and verifying transaction behavior. They help catch security issues, edge cases, and logic errors before anything is deployed—giving you confidence in what the transaction will actually do.

## Simulations vs. Re-Simulations

-	**Simulation**: Create a brand-new transaction with custom parameters and preview the result without sending anything on-chain.
-	**Re-Simulation**: Replay an existing on-chain transaction, optionally tweak its parameters, and see how different outcomes might unfold.

## Walnut Simulation Page

The Simulation page in Walnut lets you configure the details of a transaction simulation. Here’s what each field does:

![Screenshot of the Simulation Form Page on Walnut](/img/simulation/simulation_page.png "Screenshot of the Simulation Form Page on Walnut")


Form Breakdown:

- **Network** - The network where the simulation will run (e.g. Mainnet, Sepolia, or a custom network, which is often useful for appchains).
- **Sender address** - Test how a transaction behaves when sent from any address. No private keys are required for simulations.
- **Number of contract calls** - Number of contract calls to perform by the simulation execution. For each call, you'll specify:
  - **Contract address** - Address of the contract being called.
  - **Entrypoint** - The function to call from the contract. Available options are auto-populated from the contract’s ABI.
  - **Calldata** - Data passed to the entrypoint, formatted according to Cairo serialization. For more details, see [Serialization of Cairo Types](https://docs.starknet.io/architecture-and-concepts/smart-contracts/serialization-of-cairo-types/).
- **Block number** - Block number on which the simulation will run. If left blank, latest block number will be used.
- **Transaction version** - In most cases, just use 3. For more details, refer to the official [**Starknet documentation**](https://docs.starknet.io/architecture-and-concepts/network-architecture/transactions/).

:::tip
For a step-by-step guide how to fill this form, see [Example: Simulate new Transaction](example-simulate) or [Example: Re-simulate existing Transaction](example-resimulate).
:::
