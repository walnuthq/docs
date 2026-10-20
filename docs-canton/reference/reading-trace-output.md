---
sidebar_position: 2
title: 'Reading trace output'
description: 'Fields of the dpm trace header and event tree'
---

`dpm trace` prints a header and a tree, and `dpm trace open` prints a third part before them.

- **Trace artifact**: describes the file you exported (`schema`, `update`, `kind`, `source`, `read-as`, `events`). This is printed only by `open`.
- **Canton trace**: the transaction header.
- **Trace**: the tree of events, one line per event, like `[ID] KIND Template.Choice`.

Fields of the Canton trace header:

- `update`: the update ID.
- `source`: where the update was read from, and the endpoint used.
- `offset`: the ledger offset of the update.
- `record time`: when the synchronizer recorded the update.
- `synchronizer`: the synchronizer that sequenced the update.
- `read-as`: the party the trace was read as.
- `visibility`: this is one participant's projection for that party. It is not a global Canton transaction.
- `events`: the count per kind, shown as `+` create, `>` exercise and `x` archive.
- `parties`: the party names that appear in the trace, with their full IDs.

Fields of an event in the tree:

- `contract`: the contract ID, shortened.
- `consuming`: whether an exercise archives the contract.
- `actors`: the parties that exercised the choice.
- `signatories` and `observers`: the contract's stakeholders.
- `witnesses`: the parties that saw the event, within the party you read as.
- `argument` and `result`: the choice argument and its return value.
- `payload`: the contract's fields.
