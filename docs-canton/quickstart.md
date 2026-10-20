---
sidebar_position: 3
title: 'Quickstart'
description: 'Set up a local ledger, submit a command, and trace it'
---

This quickstart takes you from a running ledger to a traced transaction: set up the example ledger, submit a command, trace it, and read it as another party.
Before you start:
- `dpm trace` is registered, as described in [Register with DPM](./install.md#register-with-dpm).
- You have a clone of the [repository](https://github.com/walnuthq/dpm-trace), because the example ledger lives in `examples/`: `git clone https://github.com/walnuthq/dpm-trace.git && cd dpm-trace`.
- Java 17 or newer, `curl`, and `python3` are on your `PATH`.
- The Canton JAR is in the DPM cache. If it is missing, run `dpm install <sdk-version>`, or set `CANTON_JAR=<path-to-canton.jar>`.
## Set up the example ledger
The example used in these docs comes from [examples/asset](https://github.com/walnuthq/dpm-trace/tree/main/examples/asset). Its `Asset` template has an issuer, an owner, a name, and a quantity. The owner can `Split` it into two assets, `Transfer` it, `Withdraw` part of its quantity, or `Burn` it.

To set everything up, run `up.sh`. It builds the DAR, starts a local Canton, uploads the DAR, creates the `Issuer`, `Alice`, and `Bob` parties, and exports their IDs. The network is defined in [examples/devnet-trace.conf](https://github.com/walnuthq/dpm-trace/blob/main/examples/devnet-trace.conf): two participants on one synchronizer, with `Issuer` and `Alice` on `participant1` and `Bob` on `participant2`.
```bash
building the example DAR ...
Running single package build of asset-tests as no multi-package.yaml was found.

2026-10-19 08:42:04.88 [INFO]  [build]
Compiling asset-tests to a DAR.
File:     daml
Hidden:   no
Range:    1:1-2:1
Source:   Daml-LF typechecker
Severity: DsWarning
Message:
warning while type checking package:
  The following dependencies are not used:
   - 48c08b5fdedad07e9f4d8033732fa5d36714e2eec849b8b58c112bb2aa5da096 (daml-script, 3.5.1)
  These dependencies can be removed from your daml.yaml
  Upgrade this warning to an error -Werror=unused-dependency
  Disable this warning entirely with -Wno-unused-dependency

2026-10-19 08:42:06.36 [INFO]  [build]
Created .daml/dist/asset-tests-1.0.0.dar
starting Canton (pid 38754, log <path-to-dpm-trace>/examples/.up/canton.log) ...
export LEDGER='http://127.0.0.1:6113'
export LEDGER2='http://127.0.0.1:6123'
export ISSUER='Issuer::1220943998ef3c20591cb7d919a92935a8c290e3f010cab947845648e1b147ce337f'
export ALICE='Alice::1220943998ef3c20591cb7d919a92935a8c290e3f010cab947845648e1b147ce337f'
export BOB='Bob::12203f2834c8e8555dd26a1e0c564fcb76828079e70b89bc6cfea3d20260f633dbf9'
Canton is ready: participant1 http://127.0.0.1:6113, participant2 http://127.0.0.1:6123
To use in another shell run: source examples/.env
Stop Canton with: ./examples/up.sh down

```
The variables `LEDGER`, `ISSUER`, `ALICE`, and `BOB` are used in every example below. In a new shell, run `source examples/.env` to set them. When you are done, stop Canton with `up.sh down`.

If you prefer to set this up yourself, start a local ledger with [dpm sandbox](https://docs.canton.network/sdks-tools/development-tools/sandbox) (or [LocalNet](https://docs.canton.network/sdks-tools/development-tools/localnet) for several validators), [upload the DAR](https://docs.canton.network/reference/json-api-reference/post-v2packages), and [create the parties](https://docs.canton.network/reference/json-api-reference/post-v2parties) by following the Canton documentation.
## Submit a command
To create an `Asset` as the issuer, we use `dpm trace submit`:
```bash
dpm trace submit \
  --submitter "$LEDGER" \
  --act-as "$ISSUER" \
  --template '#asset-tests:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" \
  --arg name=GOLD --arg quantity=100
```
Output is the update ID:
```bash
12200833d9637f296c082ec1f6322f47cc8e7d934c1e27f10c76aa017abba1d14fde
```
- `--submitter`: URL of the participant's JSON Ledger API.
- `--act-as`: the party that submits the command.
- `--template`: the template to create, as `#package:Module:Template`.
- `--arg`: input field of the contract; in our example `issuer` is `Issuer`, `owner` is `Alice`, `name` is the name of the asset (`GOLD`), and `quantity` is how much of it there is (`100`).
## Trace the update ID
Pass the update ID and the party to read as.
```bash
dpm trace 12200833d9637f296c082ec1f6322f47cc8e7d934c1e27f10c76aa017abba1d14fde \
  --submitter "$LEDGER" --read-as "$ISSUER"
```
Both flags are required:
- `--submitter`: the participant's JSON Ledger API URL, the ledger to read the update from. Without it, `dpm trace` has no source and fails with `choose a source`.
- `--read-as`: the party whose view of the update you want. Events and data that this party is not allowed to see are left out.
```bash
Canton trace
  update:       12200833d9637f296c082ec1f6322f47cc8e7d934c1e27f10c76aa017abba1d14fde
  source:       ledger-json-api (http://127.0.0.1:6113/v2/updates/update-by-id)
  offset:       25
  record time:  2026-10-19T10:07:31.035562Z
  synchronizer: local::1220694f7d09ada2d4393803880616b6129f6a381e81dadb9b1c247e7fd00fa27ea5
  read-as:      Issuer (Issuer::1220e92d...89b47e)
  visibility:   Authorized participant projection. Private data outside these party rights is not available.
  events:       +1 create, >0 exercise, x0 archive
  parties:
    Alice = Alice::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e
    Issuer = Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e

Trace
└── [0] CREATE Asset:Asset
    ├── contract: 00a43a18ee777bbd4ebb3ba11c1fa71ed9d2fcfeced06d0b8504ee3c1487579...
    ├── signatories: Issuer
    ├── observers: Alice
    ├── witnesses: Issuer
    └── payload: { issuer: Issuer, owner: Alice, name: GOLD, quantity: 100 }

```
The output has a header and a tree of events, where each event is one line, like `[ID] KIND Template.Choice`. See [Reading trace output](./reference/reading-trace-output.md) for the details of every field.

In this trace there is one `CREATE` event: `Issuer` signs it, and `Alice` sees it as an observer.
## Read the update as another party
Read the same update as `Alice`.
```bash
dpm trace 12200833d9637f296c082ec1f6322f47cc8e7d934c1e27f10c76aa017abba1d14fde \
  --submitter "$LEDGER" --read-as "$ALICE"
```
Output:
```bash
Canton trace
  update:       12200833d9637f296c082ec1f6322f47cc8e7d934c1e27f10c76aa017abba1d14fde
  source:       ledger-json-api (http://127.0.0.1:6113/v2/updates/update-by-id)
  offset:       25
  record time:  2026-10-19T10:07:31.035562Z
  synchronizer: local::1220694f7d09ada2d4393803880616b6129f6a381e81dadb9b1c247e7fd00fa27ea5
  read-as:      Alice (Alice::1220e92d...89b47e)
  visibility:   Authorized participant projection. Private data outside these party rights is not available.
  events:       +1 create, >0 exercise, x0 archive
  parties:
    Alice = Alice::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e
    Issuer = Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e

Trace
└── [0] CREATE Asset:Asset
    ├── contract: 00a43a18ee777bbd4ebb3ba11c1fa71ed9d2fcfeced06d0b8504ee3c1487579...
    ├── signatories: Issuer
    ├── observers: Alice
    ├── witnesses: Alice
    └── payload: { issuer: Issuer, owner: Alice, name: GOLD, quantity: 100 }
```
`Alice` is the owner of the asset, so she sees the same tree.

Now read the same update as `Bob`.
```bash
dpm trace 12200833d9637f296c082ec1f6322f47cc8e7d934c1e27f10c76aa017abba1d14fde \
  --submitter "$LEDGER" --read-as "$BOB"
```
Output:
```bash
error: POST http://127.0.0.1:6113/v2/updates/update-by-id failed with HTTP 404: {"code":"UPDATE_NOT_FOUND","cause":"Update not found, or not visible.","correlationId":null,"traceId":"644bf607fad306c6fb13a2a58a828e28","context":{"participant":"participant1","definite_answer":"false","tid":"644bf607fad306c6fb13a2a58a828e28","category":"11"},"resources":[["ErrorResource(UPDATE_ID)","12200833d9637f296c082ec1f6322f47cc8e7d934c1e27f10c76aa017abba1d14fde"]],"errorCategory":11,"grpcCodeValue":5,"retryInfo":null,"definiteAnswer":null}
```
`Bob` is not a stakeholder of the asset, so the ledger returns `UPDATE_NOT_FOUND`: the update is not visible to him.
`Bob` is hosted on `participant2`, not on the participant behind `LEDGER`. To ask Bob's own participant, use `LEDGER2`:
```bash
dpm trace 12200833d9637f296c082ec1f6322f47cc8e7d934c1e27f10c76aa017abba1d14fde \
  --submitter "$LEDGER2" --read-as "$BOB"
```
The answer is the same `UPDATE_NOT_FOUND`, now with `"participant":"participant2"` in its context, because even on his own participant `Bob` is not a stakeholder of this asset.
