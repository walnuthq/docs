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
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" \
  --arg name=GOLD --arg quantity=100
```
Output:
```bash
Prepared command
  schema:       dpm-trace/prepared-artifact/v0
  endpoint:     http://127.0.0.1:6113/v2/interactive-submission/prepare
  committed:    no
  command id:   dpm-trace-prepare-92595333d86e
  act-as:       Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7
  read-as:      -
  commands:     1
  prepared hash:JfftGcIwY6Z5aD34EqGD6dAgpVL4TBss2fikQROkWFc=
  hashing:      HASHING_SCHEME_VERSION_V2
  cost:         0 traffic (request 0, response 0)

Commands
  [0] create Asset:Asset  issuer=Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7  owner=Alice::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7  name=GOLD

Transaction (as the participant would commit it)
  └── [0] CREATE Asset:Asset
      ├── contract: 000c639f05c7feb119c59cd8b96203225f7d703d7822da9812787b7d8e334231b6 (local; assigned at commit)
      ├── signatories: Issuer
      ├── observers: Alice
      └── payload: { issuer: Issuer, owner: Alice, name: GOLD, quantity: 100 }

This is prepared transaction data from a non-committing prepare call.
```
In the output:

- `committed: no`: the command was only prepared. It was not sent to the ledger, so there is no update ID and no contract was created.
- `prepared hash`: identifies the prepared command. It is not an update ID.
- `(local; assigned at commit)`: the contract ID shown is a local one, because a prepared contract only gets its real ID when the transaction is committed.
