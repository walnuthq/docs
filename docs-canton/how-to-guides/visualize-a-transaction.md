---
sidebar_position: 6
title: 'Visualize a transaction'
description: 'Visualize a transaction'
---

`--visualize` opens an interactive session over a trace in your terminal, and it works on both `dpm trace` and `dpm trace open`.

First, create a `SILVER` asset with quantity 50. The command prints its update ID:
```bash
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset-tests:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=SILVER --arg quantity=50
```
Trace it with `--print-json`, using the update ID it printed:
```bash
dpm trace <update-id> --submitter "$LEDGER" --read-as "$ISSUER" --print-json
```
The JSON has one event, with `"kind": "create"`. Copy the value of its `contractId` line, which looks like this:
```bash
"contractId": "00238655a22f744e2a1a297a5f02692d9f0d36542adaa6324f60ad71cea3d24e56ca1212202b540b1757f2894cc33b1ef171e32a21e121e6447e565adec8a5d966bb507d92",
```
To get a tree with more than one level, `Split` the asset into two assets, 20 and 30, passing that value as `--contract-id`:
```bash
dpm trace submit \
  --submitter "$LEDGER" --act-as "$ALICE" \
  --template '#asset-tests:Asset:Asset' --choice Split \
  --contract-id <contract-id> \
  --arg splitQuantity=20
```
The output is the update ID:
```bash
12204388ea3b1241c4033f675763cacc2bba05c41d09625fb6e03fae34ad4f0f2f6f
```
Trace the `Split` with `--visualize` to step through it:
```bash
dpm trace 12204388ea3b1241c4033f675763cacc2bba05c41d09625fb6e03fae34ad4f0f2f6f \
  --submitter "$LEDGER" --read-as "$ALICE" --visualize
```
Output:
```bash
update:      12204388ea3b1241c4033f675763cacc2bba05c41d09625fb6e03fae34ad4f0f2f6f
source:      ledger-json-api (http://127.0.0.1:6113/v2/updates/update-by-id)
record time: 2026-10-19T12:24:58.067236Z
offset:      53
synchronizer:local::1220694f7d09ada2d4393803880616b6129f6a381e81dadb9b1c247e7fd00fa27ea5
projection:  Authorized participant projection. Private data outside these party rights is not available.
read-as:     Alice (Alice::1220e92d...89b47e)
events:      3

Visualizer commands: n/next, p/prev, j <n>, s/source, vars, b <spec>, c/continue, tree, context, json, q
search: filter <value>, find <value>, matches -- `help` for the full form
tree: tree [depth], collapse [id|all], expand [id|all]
values: payload to expand a truncated value, payload <text> to search this event's fields
state: diff -- the contracts this transaction created and archived

------------------------------------------------------------------------
Step 1/3 EXERCISE 0
template: 760cbb888f9afeafae5ea82834fb897b36e197a7628947f94e4bba65031d1bcc:Asset:Asset
contract: 001b91fcd041eec848da2ee5cc105...
choice: Split  consuming=True
actors: Alice
witness: Alice
choice argument:
  { splitQuantity: 20 }
choice result:
  {
    "_1": "00e38bc11efd8ed5f2fb4e935b0ca4b6f7e5d6322aa510b1817f935feaf6d28c2bca1212200f42df5e9520174b6548f28c3cdfd7b160a6c970c0be9682965bd93e226b7efe",
    "_2": "009623bcbb78c1e85d7cdd276a5dbc80889397c8558a8bc097babdae2bff4e01c4ca1212207f67f17f19d510012a8f123a3d19b2db5e87331e7023bdb2d56d7cd544bdde0a"
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
template: 760cbb888f9afeafae5ea82834fb897b36e197a7628947f94e4bba65031d1bcc:Asset:Asset
contract: 00e38bc11efd8ed5f2fb4e935b0ca...
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
template: 760cbb888f9afeafae5ea82834fb897b36e197a7628947f94e4bba65031d1bcc:Asset:Asset
contract: 009623bcbb78c1e85d7cdd276a5db...
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
    1 Asset:Asset 00e38bc11efd8ed5f2fb4e935b0ca4b6f7e5d...
      { issuer: Issuer, owner: Alice, name: SILVER, quantity: 30 }
    2 Asset:Asset 009623bcbb78c1e85d7cdd276a5dbc8088939...
      { issuer: Issuer, owner: Alice, name: SILVER, quantity: 20 }
  x archived
    0 Asset:Asset 001b91fcd041eec848da2ee5cc1056c5107c4...
  visible to Alice only; the transaction may have touched other contracts
```
The diff shows that the `Split` archived the asset you split and created two new ones, 30 and 20, each with its payload. The archived asset has no payload because the ledger reports an archive only as a consuming exercise.
To leave the session, type `q`:
```bash
dpm-trace[Alice]> q
```
