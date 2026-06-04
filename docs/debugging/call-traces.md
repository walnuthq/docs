---
sidebar_position: 1
title: 'Call Traces'
description: 'Types of calls in a Starknet transaction call trace.'
hide_title: true
---


# Call Traces

Walnut Call Trace supports three types of calls: `CALL`, `DELEGATE`, and `FUNCTION`. Each represents a specific type of contract interaction on Starknet.

:::info Starknet-specific
This page describes call trace semantics on **Starknet**. EVM transactions also surface `CALL`, `DELEGATE`, and `FUNCTION` frames in the Walnut debugger, but their meanings differ. EVM call trace semantics are not yet documented.
:::

:::info Frames
Each call item in a Walnut Call Trace is a "Frame." Frames represent the sequence of calls within a transaction.
:::

## CALL

`CALL` represents a regular contract call: a direct interaction between two contracts.

[See an example transaction with a `CALL` frame.](https://app.walnut.dev/transactions?chainId=SN_MAINNET&txHash=0x078297c72690f36059621b68b33d207999be7fcc296586f6fda7d7b5fc9b0698)

![CALL Example](/img/call_trace_types/call_example.png)

For example, in the screenshot above, the function `mint_and_deposit` on the `Ekubo:Positions` contract calls the `mint` function on the `Ekubo:PositionsNFT` contract. This interaction delegates the process of minting a new NFT to the `Ekubo:PositionsNFT` contract, which creates the NFT, updates its own storage, and returns the newly minted token ID (type `u64`).

## DELEGATE

`DELEGATE` represents a call to a function in a library from another contract class, using the storage of the caller contract. Any state changes made during this call affect the caller's storage, not the callee's (in this case, the library).

[See an example transaction with a `DELEGATE` frame.](https://app.walnut.dev/transactions?chainId=SN_MAINNET&txHash=0x048b4b35ba6c85582dae9681aa38ea9abdbc1d4286152ca8e8d23951c80efb9e)

![DELEGATE Example](/img/call_trace_types/delegate_example.png)

For example, in the screenshot above, `IExchange.multi_route_swap` initiates a sequence of calls to the `Realms:LORDS Token` contract to query balances (`balanceOf`) and perform token transfers (`transferFrom`). A delegate call is then made to the `ISwapAdapter` class to execute the logic for the swap. Any state changes made during this swap execution affect the storage of the caller contract (`IExchange`), not the `ISwapAdapter` contract.

## FUNCTION

`FUNCTION` represents function calls that are internal to a given contract. These calls reveal the internal logic and computations within the contract, which is useful for debugging and auditing.

[See an example transaction with a `FUNCTION` frame.](https://app.walnut.dev/transactions?chainId=SN_MAINNET&txHash=0x07bb1d7f7a1c496347475e24e9156edc92640d37bb488cf9181f551a89a37aa2)

![FUNCTION Example](/img/call_trace_types/function_example.png)

:::info
Public explorers typically don't display `FUNCTION` calls in their Call Trace components because blockchain nodes don't provide this data. Walnut overcomes this limitation by re-simulating each transaction using its own infrastructure. This enables Walnut to generate the full trace, including internal operations, and display the entire execution flow.
:::
