---
sidebar_position: 5
title: 'Compare transactions'
description: 'Compare transactions'
---

`dpm trace compare` shows why two things differ, whether they are two committed updates, a prepared command and an update, or a prepared command and a failed completion.
Each comparison below uses the update IDs and files from the commands in this block, so run them first:
```bash
# a GOLD asset with quantity 100
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=100

# a SILVER asset with quantity 50
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=SILVER --arg quantity=50

# the GOLD command, prepared and not committed
dpm trace prepare --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=100 \
  --export create.prepared.json

# the GOLD command with quantity 0, which fails and is saved as a completion file
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=0 \
  --export failed-create.completion.json
```
To see how two committed updates differ, pass their update IDs, the baseline first and the candidate second. Replace `<gold-update-id>` and `<silver-update-id>` with the update IDs printed by the first two commands above.
```bash
dpm trace compare <gold-update-id> <silver-update-id> \
  --submitter "$LEDGER" --read-as "$ISSUER"
```
Output:
```bash
✗ 1 difference (1 value)     kind: update-vs-update

  A  update 1220eeb66...  @ offset 34   (baseline)
  B  update 1220fddd4...  @ offset 37   (candidate)

  Events
    ~ create Asset:Asset                                 name: GOLD → SILVER, quantity: 100 → 50

  Context   read-as Issuer::12206747...278dc7   sync 2026-10-21T13:01:09.567424Z
```
To check that the ledger committed what you prepared, compare the prepared file with the GOLD update. Use the same `<gold-update-id>` as above.
```bash
dpm trace compare \
  --prepared create.prepared.json \
  --update <gold-update-id> \
  --submitter "$LEDGER" --read-as "$ISSUER"
```
Output:
```bash
✓ no differences     kind: prepared-vs-update

  A  command dpm-trace-prepare...   (prepared)
  B  update 1220eeb66...  @ offset 34   (committed)

  Events
    = create Asset:Asset                                 (4 fields match)

  Context   act-as Issuer::12206747...278dc7   read-as Issuer::12206747...278dc7   sync 2026-10-21T13:01:09.567424Z
```
The prepared command and the committed update match: both create the same `Asset`, and all four fields are equal.

To see what happened to a command that failed, compare the prepared file with the saved completion. A failed submission has no events, so the comparison tells you that it failed and why, not which event failed.
```bash
dpm trace compare \
  --prepared create.prepared.json \
  --completion-file failed-create.completion.json
```
Output:
```bash
✗ completion failed — DAML_FAILURE     kind: prepared-vs-completion

  A  command dpm-trace-prepare...   (prepared)
  B  completion dpm-trace-submit-...   offset -   DAML_FAILURE

  'Interpretation error: Error: User failure: UNHANDLED_EXCEPTION/DA.Exception.PreconditionFailed:PreconditionFailed (error category 9): Template precondition violated: Asset {issuer = \'Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7\', owner = \'Alice::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7\', name = "GOLD", quantity = 0}'

  Context   submission 5ec51247-1c33-48a...
```
