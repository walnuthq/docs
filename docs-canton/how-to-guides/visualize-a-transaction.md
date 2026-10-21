---
sidebar_position: 6
title: 'Visualize a transaction'
description: 'Visualize a transaction'
---

`--visualize` opens an interactive session over a trace in your terminal, and it works on both `dpm trace` and `dpm trace open`.

First, create a `SILVER` asset with quantity 50. The command prints its update ID:
```bash
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=SILVER --arg quantity=50
```
Trace it with `--print-json`, using the update ID it printed:
```bash
dpm trace <update-id> --submitter "$LEDGER" --read-as "$ISSUER" --print-json
```
The JSON has one event, with `"kind": "create"`. Copy the value of its `contractId` line, which looks like this:
```bash
"contractId": "0025f8f84a888e2bc9e6c81bd370c6c8933872a68a0d8c46034112033a549c1bdcca121220e7b5e563526b6409ab7981d0d2c14da03d55537cda5874fbf9ffa7a5478abdc8",
```
To get a tree with more than one level, `Split` the asset into two assets, 20 and 30, passing that value as `--contract-id`:
```bash
dpm trace submit \
  --submitter "$LEDGER" --act-as "$ALICE" \
  --template '#asset:Asset:Asset' --choice Split \
  --contract-id <contract-id> \
  --arg splitQuantity=20
```
The output is the update ID:
```bash
122070c07e71a266e2c957a8e96377c77e608fcba8e92893fe7269f73a1e4565714a
```
Trace the `Split` with `--visualize` to step through it:
```bash
dpm trace 122070c07e71a266e2c957a8e96377c77e608fcba8e92893fe7269f73a1e4565714a \
  --submitter "$LEDGER" --read-as "$ALICE" --visualize
```
Output:
```bash
update:      122070c07e71a266e2c957a8e96377c77e608fcba8e92893fe7269f73a1e4565714a
source:      ledger-json-api (http://127.0.0.1:6113/v2/updates/update-by-id)
record time: 2026-10-21T13:01:30.507204Z
offset:      43
synchronizer:local::1220e1a34ed2ad1cdc3fd97d63216fe68977ca385f9d0694b39f6f8221063fd183af
projection:  Authorized participant projection. Private data outside these party rights is not available.
read-as:     Alice (Alice::12206747...278dc7)
events:      3

Visualizer commands: n/next, p/prev, j <n>, s/source, vars, b <spec>, c/continue, tree, context, json, q
search: filter <value>, find <value>, matches -- `help` for the full form
tree: tree [depth], collapse [id|all], expand [id|all]
values: payload to expand a truncated value, payload <text> to search this event's fields
state: diff -- the contracts this transaction created and archived

------------------------------------------------------------------------
Step 1/3 EXERCISE 0
template: bfffc530374ba2990299ce8e876953c564228c6052cc67ed5d765cfbcca5d85e:Asset:Asset
contract: 0025f8f84a888e2bc9e6c81bd370c...
choice: Split  consuming=True
actors: Alice
witness: Alice
choice argument:
  { splitQuantity: 20 }
choice result:
  {
    "_1": "003b744859f84a2b3f1c10bbb8b3c69c71d34270932828567acd57a272523b4285ca1212201f2a10690ee571899dc1b80becbeda33e2aad4b1badb6d46333cf4370f606e94",
    "_2": "001e44d9dab7fba90e84b45f326b1cae6b5b9e26f18edf3df83973ed1eab7a6d3dca121220fa62d6b8273aadbf6c9c45f5180a8deb21e18623ff0ccec6634b15cc3376bd49"
  }
children: 1, 2
```
The session opens on the first event, the `Split` exercise. To see the whole tree at once, type `tree`; `=>` marks the event you are on:
```bash
dpm-trace[Alice]> tree
=> └── EXERCISE 0 Asset:Asset.Split
       ├── CREATE   1 Asset:Asset
       └── CREATE   2 Asset:Asset
```
The `Split` is one `EXERCISE` event with two `CREATE` events under it.

To move to the next event, type `n`, and `p` goes back to the previous one. The first `CREATE` is the asset of 30 that stays with `Alice`:
```bash
dpm-trace[Alice]> n

------------------------------------------------------------------------
Step 2/3 CREATE 1
template: bfffc530374ba2990299ce8e876953c564228c6052cc67ed5d765cfbcca5d85e:Asset:Asset
contract: 003b744859f84a2b3f1c10bbb8b3c...
witness: Alice
stakeholders: signatories=['Issuer'] observers=['Alice']
payload:
  { issuer: Issuer, owner: Alice, name: SILVER, quantity: 30 }
```
The second `CREATE` is the new asset of 20, which also belongs to `Alice`:
```bash
dpm-trace[Alice]> n

------------------------------------------------------------------------
Step 3/3 CREATE 2
template: bfffc530374ba2990299ce8e876953c564228c6052cc67ed5d765cfbcca5d85e:Asset:Asset
contract: 001e44d9dab7fba90e84b45f326b1...
witness: Alice
stakeholders: signatories=['Issuer'] observers=['Alice']
payload:
  { issuer: Issuer, owner: Alice, name: SILVER, quantity: 20 }
```
To see which contracts the `Split` created and archived, type `diff`:
```bash
dpm-trace[Alice]> diff
state diff: 2 contracts created, 1 contract archived
  + created
    1 Asset:Asset 003b744859f84a2b3f1c10bbb8b3c69c71d34...
      { issuer: Issuer, owner: Alice, name: SILVER, quantity: 30 }
    2 Asset:Asset 001e44d9dab7fba90e84b45f326b1cae6b5b9...
      { issuer: Issuer, owner: Alice, name: SILVER, quantity: 20 }
  x archived
    0 Asset:Asset 0025f8f84a888e2bc9e6c81bd370c6c893387...
  visible to Alice only; the transaction may have touched other contracts
```
The diff shows that the `Split` archived the asset you split and created two new ones, 30 and 20, each with its payload. The archived asset has no payload because the ledger reports an archive only as a consuming exercise.
To leave the session, type `q`:
```bash
dpm-trace[Alice]> q
```
