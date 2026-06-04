---
sidebar_position: 2
title: 'Debug Dojo Transactions'
description: 'How to debug Dojo transactions with Walnut'
hide_title: true
---

# Debug Dojo Transactions

_Note: We assume that the Dojo environment is set up with a running Slot instance. For setup guidance, refer to the [docs](https://www.dojoengine.org)._

:::tip   
To get the step-by-step debugger working, you need to verify your contracts on Walnut. Check the [Verification Sozo Docs](../verification/verify-starknet#sozo-verification) for more information.
:::

## Debug Transactions on Slot

1. Add your custom network by following the steps in the [Custom Networks section](../custom-networks/overview).

2. Once the network is added, search for your transaction using the Walnut search bar at the top.

![Search tx](/img/debug_dojo_with_walnut/search_tx.png "Search tx")

## Debug with `sozo execute`

To debug transactions with `sozo`, run `sozo execute --walnut`:

```shell
  sozo execute dojo_starter-actions move_character 2 --wait --walnut
```

A link to the Walnut Debugger will appear in the Terminal for each transaction.

```shell
  Debug transaction with Walnut: https://app.walnut.dev/transactions?rpcUrl=https%253A%252F%252Fapi.cartridge.gg%252Fx%252Fdeploymentslot2%252Fkatana&txHash=0x04b16a16129402d3b4854c4191505d3b3fd6e042b3a59eeb34f0fdc78674a748

  Transaction hash: 0x04b16a16129402d3b4854c4191505d3b3fd6e042b3a59eeb34f0fdc78674a748
```
