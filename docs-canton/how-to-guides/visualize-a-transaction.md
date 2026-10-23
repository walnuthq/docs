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
"contractId": "000c4a93191f47c868837edef5cef13d83cd8425cfe50570e45f62c53bc308fd19ca121220d921e395683face343332648b833fa28cbb19b1fe95b5103c345ed664ddaba16",
```
To get a tree with more than one level, `Split` the asset into two assets, 30 and 20, passing that value as `--contract-id`:
```bash
dpm trace submit \
  --submitter "$LEDGER" --act-as "$ALICE" \
  --template '#asset:Asset:Asset' --choice Split \
  --contract-id <contract-id> \
  --arg splitQuantity=20
```
The output is the update ID:
```bash
12207ec3bd95e9d532337c69ff3e87585d9cd40f9824fc9bd26dd98e067f52aa02d0
```
Trace the `Split` with `--visualize` to step through it:
```bash
dpm trace 12207ec3bd95e9d532337c69ff3e87585d9cd40f9824fc9bd26dd98e067f52aa02d0 \
  --submitter "$LEDGER" --read-as "$ALICE" --visualize
```
Output:
```bash
update:      12207ec3bd95e9d532337c69ff3e87585d9cd40f9824fc9bd26dd98e067f52aa02d0
source:      ledger-json-api (http://127.0.0.1:6113/v2/updates/update-by-id)
record time: 2026-10-22T09:26:40.608807Z
offset:      28
synchronizer:local::122056d34f246b0938333adc393eb5cd258b3d104ac3bbf9c036caea3fc84216c43f
projection:  Authorized participant projection. Private data outside these party rights is not available.
read-as:     Alice (Alice::122025db...68416f)
events:      3

Visualizer commands: n/next, p/prev, j <n>, s/source, vars, b <spec>, c/continue, tree, context, json, q
search: filter <value>, find <value>, matches -- `help` for the full form
tree: tree [depth], collapse [id|all], expand [id|all]
values: payload to expand a truncated value, payload <text> to search this event's fields
state: diff -- the contracts this transaction created and archived

------------------------------------------------------------------------
Step 1/3 EXERCISE 0
template: 5e17e5ac442c57c8ed79d27e3970c4804d38ea28103dd8f99c820831cb853468:Asset:Asset
contract: 000c4a93191f47c868837edef5cef...
choice: Split  consuming=True
actors: Alice
witness: Alice
choice argument:
  { splitQuantity: 20 }
choice result:
  {
    "_1": "00a3c19c0e9ea2c19458256fb7c689001c89e502e12fd89714e178fa7d9339da2dca121220a1b71a6a4e95883a2d86e1fd56777808e9acd2f510e05149099d5102463f9bd5",
    "_2": "00f04fd3aca0bc75ee1ac26cc41804b5813fcadfa9a9f148e5ad96e66f2aebb6b4ca121220414036024dbd8259d8086f6c59eabe3dff454fdb7571c06137b52c79a524509d"
  }
children: 1, 2
```
The `projection` line says that this is what the participant shows for `Alice`, not the whole transaction. Each party sees only the events it is a stakeholder or an actor of. [Read the same transaction as another party](#read-the-same-transaction-as-another-party) shows an example.

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
template: 5e17e5ac442c57c8ed79d27e3970c4804d38ea28103dd8f99c820831cb853468:Asset:Asset
contract: 00a3c19c0e9ea2c19458256fb7c68...
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
template: 5e17e5ac442c57c8ed79d27e3970c4804d38ea28103dd8f99c820831cb853468:Asset:Asset
contract: 00f04fd3aca0bc75ee1ac26cc4180...
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
    1 Asset:Asset 00a3c19c0e9ea2c19458256fb7c689001c89e...
      { issuer: Issuer, owner: Alice, name: SILVER, quantity: 30 }
    2 Asset:Asset 00f04fd3aca0bc75ee1ac26cc41804b5813fc...
      { issuer: Issuer, owner: Alice, name: SILVER, quantity: 20 }
  x archived
    0 Asset:Asset 000c4a93191f47c868837edef5cef13d83cd8...
  visible to Alice only; the transaction may have touched other contracts
```
The diff shows that the `Split` archived the asset you split and created two new ones, 30 and 20, each with its payload. The archived asset has no payload because the ledger reports an archive only as a consuming exercise. The last line repeats that this is `Alice`'s view: contracts she cannot see are not listed.

## Filter events and search a payload

With `filter`, `n` and `p` stop only on the events that match it and skip the rest. The tree itself does not change. To keep only the `CREATE` events, type `filter kind create`:
```bash
dpm-trace[Alice]> filter kind create
filter: kind create  (2 of 3 steps)
```
The prompt now shows the active filter. To list the events it matches, type `matches`; `>` marks the event you are on:
```bash
dpm-trace[Alice] filter:kind create> matches
matches: kind create
   [2] 1 CREATE Asset:Asset
 > [3] 2 CREATE Asset:Asset
```
You can also filter by `template`, `choice`, `party`, `contract`, `package`, `id`, `payload` or `synchronizer`. Matching is partial and case-insensitive, so `filter party Alice` works without the party's fingerprint. See [Visualizer commands](../reference/visualizer-commands.md).

`payload <text>` prints only the lines of the current event's payload, argument and result that contain the text:
```bash
dpm-trace[Alice] filter:kind create> payload quantity
payload:
  { issuer: Issuer, owner: Alice, name: SILVER, quantity: 20 }
```
An `Asset` payload fits on one line, so the whole value matches. On a contract with many fields, only the matching lines are printed. The session shows at most eight lines of a value and cuts the rest. To print the whole value, type `payload` with no text.

To clear the filter, type `filter`, and to leave the session, type `q`:
```bash
dpm-trace[Alice] filter:kind create> filter
filter cleared
dpm-trace[Alice]> q
```

## Read the same transaction as another party

To see how another party's view differs, `Transfer` the asset of 20 from `Alice` to `Bob`. Pass its contract ID, the `_2` value in the `Split` choice result:
```bash
dpm trace submit --submitter "$LEDGER" --act-as "$ALICE" \
  --template '#asset:Asset:Asset' --choice Transfer \
  --contract-id 00f04fd3aca0bc75ee1ac26cc41804b5813fcadfa9a9f148e5ad96e66f2aebb6b4ca121220414036024dbd8259d8086f6c59eabe3dff454fdb7571c06137b52c79a524509d \
  --arg newOwner="$BOB"
```
The output is the update ID:
```bash
12205436b20e0bf35b0b4c982dbf0070866ae2d270bbc298ff025fb6cbfe2da692a5
```
Open it as `Alice`, and type `tree` and `diff`:
```bash
dpm trace 12205436b20e0bf35b0b4c982dbf0070866ae2d270bbc298ff025fb6cbfe2da692a5 \
  --submitter "$LEDGER" --read-as "$ALICE" --visualize
```
Output:
```bash
dpm-trace[Alice]> tree
=> └── EXERCISE 0 Asset:Asset.Transfer
       └── CREATE   1 Asset:Asset
dpm-trace[Alice]> diff
state diff: 1 contract created, 1 contract archived
  + created
    1 Asset:Asset 0033a3cffd0c1857fd43d5132b29594c74da4...
      { issuer: Issuer, owner: Bob, name: SILVER, quantity: 20 }
  x archived
    0 Asset:Asset 00f04fd3aca0bc75ee1ac26cc41804b5813fc...
  visible to Alice only; the transaction may have touched other contracts
dpm-trace[Alice]> q
```
`Alice` sees the `Transfer` exercise and the new asset it created for `Bob`. Now open the same update as `Bob`, on his own participant. `LEDGER2` is the JSON Ledger API of `participant2`, set by `up.sh`:
```bash
dpm trace 12205436b20e0bf35b0b4c982dbf0070866ae2d270bbc298ff025fb6cbfe2da692a5 \
  --submitter "$LEDGER2" --read-as "$BOB" --visualize
```
Output:
```bash
update:      12205436b20e0bf35b0b4c982dbf0070866ae2d270bbc298ff025fb6cbfe2da692a5
source:      ledger-json-api (http://127.0.0.1:6123/v2/updates/update-by-id)
record time: 2026-10-22T09:33:01.900209Z
offset:      21
synchronizer:local::122056d34f246b0938333adc393eb5cd258b3d104ac3bbf9c036caea3fc84216c43f
projection:  Authorized participant projection. Private data outside these party rights is not available.
read-as:     Bob (Bob::12209c78...38e26e)
events:      1

...

------------------------------------------------------------------------
Step 1/1 CREATE 0
template: 5e17e5ac442c57c8ed79d27e3970c4804d38ea28103dd8f99c820831cb853468:Asset:Asset
contract: 0033a3cffd0c1857fd43d5132b295...
witness: Bob
stakeholders: signatories=['Issuer'] observers=['Bob']
payload:
  { issuer: Issuer, owner: Bob, name: SILVER, quantity: 20 }
```
Type `tree` and `diff`:
```bash
dpm-trace[Bob]> tree
=> └── CREATE   0 Asset:Asset
dpm-trace[Bob]> diff
state diff: 1 contract created, 0 contracts archived
  + created
    0 Asset:Asset 0033a3cffd0c1857fd43d5132b29594c74da4...
      { issuer: Issuer, owner: Bob, name: SILVER, quantity: 20 }
  visible to Bob only; the transaction may have touched other contracts
dpm-trace[Bob]> q
```
The same update has two events for `Alice` and one for `Bob`. A party sees an event only if it is a stakeholder of the contract (a signatory or an observer) or an actor of the choice:
- `Alice` is the observer of the asset she transferred and the actor of `Transfer`, so she sees the exercise and everything under it.
- `Bob` is not a stakeholder of `Alice`'s asset and did not exercise the choice, so the `Transfer` exercise and the archive are not in his view. He is the observer of the new asset, so he sees its `CREATE`.

For `Bob`, `diff` shows a contract created and nothing archived, although the transaction did archive `Alice`'s asset. An event that is missing from a view does not mean it did not happen, only that this party cannot see it.

The same contract `0033a3cf...` is event `1` for `Alice` and event `0` for `Bob`, and the offset is `31` on `participant1` and `21` on `participant2`. Each participant numbers only the events it has and keeps its own offsets, so compare views by contract ID and update ID, not by event ID or offset.
