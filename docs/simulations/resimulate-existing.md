---
sidebar_position: 3
title: 'Re-simulate Existing Transactions'
description: 'Example of re-simulating an existing transaction on Walnut'
hide_title: true
---

# Re-simulate Existing Transactions

In this example, we’ll walk through how to re-simulate a transaction that initially failed due to an issue with the calldata.

## Step 1: Locate and Analyze the Failed Transaction

Open [Walnut](http://app.walnut.dev) and use the search to find the transaction with hash: `0x04e9aaf268efe3fd9a328f5d40867231dfae14549126db8ed5471d3b3ed4da78`.

![Analyze Transaction](/img/simulation/re-simulation_analyze.png "Analyze Transaction")
<!-- <Screenshot src={ReSimulationAnalyze} alt="Analyze Transaction" /> -->

The transaction reverted with the following error message: `"Number must be greater than 0"`, which originates from `is_positive` function call.

Reviewing the calldata shows the function received `0`, which violates the function's requirement for a positive number.

## Step 2: Re-Simulate the Transaction

To resolve the issue, modify the calldata by replacing the invalid value `0x0` with a valid positive number, such as `0x5`. This satisfies the `is_positive` function's requirement. 

![Re-Simulation Example Form Field](/img/simulation/re-simulation_example.png "Re-Simulation Example Form Field")
<!-- <Screenshot src={ReSimulationExample} alt="Re-Simulation Example Form Field" /> -->

Click **"Run Simulation"** to execute the transaction with the updated calldata.

## Step 3: Check the Simulation Result

After running the simulation with the updated calldata, the transaction succeeds. The error is resolved because the updated argument (`0x5`) satisfies the `is_positive` function's requirement. 

You can view the results [here](https://app.walnut.dev/simulations?senderAddress=0x0565f25d19b517d45793b664084d02d5629cdda04e9a57ff44c36b2da157e65f&calldata=0x1%2C0x1d9afc66bb8bf890fd3395e85da7e7173236cb36eb4d33360bc21552d2865e5%2C0xad6422d28af18f3ff5089f6ba5268de9ba155aca3e2e38f5aec314fb140845%2C0x1%2C0x5&transactionVersion=1&blockNumber=395442&chainId=SN_SEPOLIA).

