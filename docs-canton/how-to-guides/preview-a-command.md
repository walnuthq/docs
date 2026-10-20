---
sidebar_position: 3
title: 'Preview a command'
description: 'Preview a command'
---

`dpm trace prepare` shows what a command would do by asking the participant to work out the whole transaction it would produce without committing it, so nothing is written to the ledger.
```bash
dpm trace prepare \
  --submitter "$LEDGER" \
  --act-as "$ISSUER" \
  --template '#asset-tests:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" \
  --arg name=GOLD --arg quantity=100
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
  [0] create Asset:Asset  issuer=Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e  owner=Alice::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e  name=GOLD

Transaction (as the participant would commit it)
  └── [0] CREATE Asset:Asset
      ├── contract: 009631faa94e5ee5b9ef4acec4698e1c4da505908c45c8b61cb84e578ee522ad3a
      ├── signatories: Issuer
      ├── observers: Alice
      └── payload: { issuer: Issuer, owner: Alice, name: GOLD, quantity: 100 }

This is prepared transaction data from a non-committing prepare call.
```
In the output:

- `committed: no`: the command was only prepared. It was not sent to the ledger, so there is no update ID and no contract was created.
- `prepared hash`: identifies the prepared command. It is not an update ID.
