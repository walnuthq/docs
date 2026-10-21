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
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=100

# the same command, prepared and not committed
dpm trace prepare --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=100 \
  --export create.prepared.json
```
The first command prints an update ID, for example `122010d3ce4186f9a2d1f5737d6198c3e6ea6c51ec50b591d8a1e9a77f67bc8ca3e4`. Pass it to `dpm trace` to save the trace of that update:
```bash
dpm trace 122010d3ce4186f9a2d1f5737d6198c3e6ea6c51ec50b591d8a1e9a77f67bc8ca3e4 \
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
  update:       122010d3ce4186f9a2d1f5737d6198c3e6ea6c51ec50b591d8a1e9a77f67bc8ca3e4
  kind:         committed-update
  source:       ledger-json-api
  read-as:      Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7
  events:       1
Canton trace
  update:       122010d3ce4186f9a2d1f5737d6198c3e6ea6c51ec50b591d8a1e9a77f67bc8ca3e4
  source:       ledger-json-api (http://127.0.0.1:6113/v2/updates/update-by-id)
  offset:       31
  record time:  2026-10-21T13:00:58.257345Z
  synchronizer: local::1220e1a34ed2ad1cdc3fd97d63216fe68977ca385f9d0694b39f6f8221063fd183af
  read-as:      Issuer (Issuer::12206747...278dc7)
  visibility:   Authorized participant projection. Private data outside these party rights is not available.
  events:       +1 create, >0 exercise, x0 archive
  parties:
    Alice = Alice::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7
    Issuer = Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7

Trace
└── [0] CREATE Asset:Asset
    ├── contract: 00d2984feea88a685dd8bd5a062f128bfd9c060207b812ea4093f4fdb66a4df...
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
  command id:   dpm-trace-prepare-ce48362160ae
  act-as:       Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7
  read-as:      -
  commands:     1
  prepared hash:LspvdDuJnPVmoDhXmkhgb/Qb5Md6V8/aOheHZkjK60Y=
  hashing:      HASHING_SCHEME_VERSION_V2
  cost:         0 traffic (request 0, response 0)

Commands
  [0] create Asset:Asset  issuer=Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7  name=GOLD  owner=Alice::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7

Transaction (as the participant would commit it)
  └── [0] CREATE Asset:Asset
      ├── contract: 009a5528f159ece40b8435a4efc9a9de3542ae2bb7a8a19920dafc6a421eff2b5a (local; assigned at commit)
      ├── signatories: Issuer
      ├── observers: Alice
      └── payload: { issuer: Issuer, owner: Alice, name: GOLD, quantity: 100 }

This is prepared transaction data from a non-committing prepare call.
```
A completion file is the participant's answer to a submitted command, which, for a failed command, is the rejection. Save it with `dpm trace submit --export <file>` and read it with `dpm trace --completion-file <file>`, as in [Trace a failed submission](./trace-a-failed-submission.md).
