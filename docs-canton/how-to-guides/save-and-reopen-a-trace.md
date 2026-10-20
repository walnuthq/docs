---
sidebar_position: 4
title: 'Save and reopen a trace'
description: 'Save and reopen a trace'
---

`--export <file>` saves what you are looking at, so you can open it later without a ledger. It works on `dpm trace <update-id>` (a trace artifact), `dpm trace prepare` (a prepared artifact), and `dpm trace submit` (the raw rejection, as a completion file).

To try it, first submit a command and prepare the same command:
```bash
# a committed update, which prints its update ID
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset-tests:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=100

# the same command, prepared and not committed
dpm trace prepare --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset-tests:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=100 \
  --export create.prepared.json
```
The first command prints an update ID, for example `1220b57c926f0b004cb16a53dd0fde7d483511efbeca82cb84bd7edfdab7d0f45b17`. Pass it to `dpm trace` to save the trace of that update:
```bash
dpm trace 1220b57c926f0b004cb16a53dd0fde7d483511efbeca82cb84bd7edfdab7d0f45b17 \
  --submitter "$LEDGER" --read-as "$ISSUER" --export create.trace.json
```
Open it with `dpm trace open`, which needs no ledger:
```bash
dpm trace open create.trace.json
```
Output:
```bash
Trace artifact
  schema:       dpm-trace/trace-artifact/v0
  update:       1220b57c926f0b004cb16a53dd0fde7d483511efbeca82cb84bd7edfdab7d0f45b17
  kind:         committed-update
  source:       ledger-json-api
  read-as:      Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e
  events:       1
Canton trace
  update:       1220b57c926f0b004cb16a53dd0fde7d483511efbeca82cb84bd7edfdab7d0f45b17
  source:       ledger-json-api (http://127.0.0.1:6113/v2/updates/update-by-id)
  offset:       138
  record time:  2026-10-20T05:34:56.688408Z
  synchronizer: local::1220694f7d09ada2d4393803880616b6129f6a381e81dadb9b1c247e7fd00fa27ea5
  read-as:      Issuer (Issuer::1220e92d...89b47e)
  visibility:   Authorized participant projection. Private data outside these party rights is not available.
  events:       +1 create, >0 exercise, x0 archive
  parties:
    Alice = Alice::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e
    Issuer = Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e

Trace
└── [0] CREATE Asset:Asset
    ├── contract: 001b117129989c7dad024f9331cb4e1a98878b22a231c3e55429a6118afff5b...
    ├── signatories: Issuer
    ├── observers: Alice
    ├── witnesses: Issuer
    └── payload: { issuer: Issuer, name: GOLD, owner: Alice, quantity: 100 }
```
The prepared command opens the same way:
```bash
dpm trace open create.prepared.json
```
Output:
```bash
Prepared command
  schema:       dpm-trace/prepared-artifact/v0
  endpoint:     http://127.0.0.1:6113/v2/interactive-submission/prepare
  committed:    no
  command id:   dpm-trace-prepare-a8ee6bb81452
  act-as:       Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e
  read-as:      -
  commands:     1
  prepared hash:Sa3REz6E0wsRMtgjsbLwPtIgxmh0JZg4VlbuhlDBe+o=
  hashing:      HASHING_SCHEME_VERSION_V2
  cost:         0 traffic (request 0, response 0)

Commands
  [0] create Asset:Asset  issuer=Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e  name=GOLD  owner=Alice::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e

Transaction (as the participant would commit it)
  └── [0] CREATE Asset:Asset
      ├── contract: 009631faa94e5ee5b9ef4acec4698e1c4da505908c45c8b61cb84e578ee522ad3a
      ├── signatories: Issuer
      ├── observers: Alice
      └── payload: { issuer: Issuer, owner: Alice, name: GOLD, quantity: 100 }

This is prepared transaction data from a non-committing prepare call.
```
A completion file is the participant's answer to a submitted command, which, for a failed command, is the rejection. Save it with `dpm trace submit --export <file>` and read it with `dpm trace --completion-file <file>`, as in [Trace a failed submission](./trace-a-failed-submission.md).
