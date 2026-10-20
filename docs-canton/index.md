---
sidebar_position: 1
title: 'DPM Trace'
description: 'Trace Canton transactions with dpm trace'
hide_title: true
---

# DPM Trace

`dpm trace` shows what a Canton transaction did as a tree of events: which contracts were created or archived, which choices were exercised, by whom, and with which arguments.
It reads a transaction from one participant, as one party, and shows only what that party can see. Each party has a different view of a transaction, so the same update can look different, or be missing, for another party.
When a submission is rejected, no transaction is committed. `dpm trace` reads the rejection instead and shows the command you sent and the reason the participant gave.

These docs are organized as follows:

- [Install](./install.md): get the binary and register it with DPM.
- [Quickstart](./quickstart.md): set up a local ledger, submit a command, and trace it as two different parties.
- [How-to guides](./how-to-guides/index.md): short guides to trace a rejected submission, preview or compare transactions, step through a trace, and run Daml Script tests in CI.
- [Reference](./reference/commands.md): every command and flag, what each field in the trace output means, and visualizer commands.
