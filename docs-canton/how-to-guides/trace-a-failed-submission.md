---
sidebar_position: 1
title: 'Trace a failed submission'
description: 'Trace a failed submission'
---

To get a rejection, create an `Asset` with quantity `0`. The template requires a positive quantity, so the participant rejects it before sequencing:
```bash
dpm trace submit \
  --submitter "$LEDGER" \
  --act-as "$ISSUER" \
  --template '#asset-tests:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" \
  --arg name=GOLD --arg quantity=0
```
Output:
```bash
✗ submission failed  DAML_FAILURE
  'Interpretation error: Error: User failure: UNHANDLED_EXCEPTION/DA.Exception.PreconditionFailed:PreconditionFailed (error category 9): Template precondition violated: Asset {issuer = \'Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e\', owner = \'Alice::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e\', name = "GOLD", quantity = 0}'

  Command                                              (what you sent)
    create Asset:Asset  issuer=Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e  owner=Alice::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e  name=GOLD
    act-as Issuer::1220e92d...89b47e    command id dpm-trace-submit-...    offset -

  Next
    rerun with --export <file> to capture this rejection, then
    dpm trace compare --prepared <prepared.json> --completion-file <file>
```
The summary above is not saved anywhere. To keep the rejection, run the same command again with `--export`:
```bash
dpm trace submit \
  --submitter "$LEDGER" \
  --act-as "$ISSUER" \
  --template '#asset-tests:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" \
  --arg name=GOLD --arg quantity=0 \
  --export failed-create.completion.json
```
Then read the saved file:
```bash
dpm trace --completion-file failed-create.completion.json
```
Output:
```bash
DPM trace completion
  result:     completion failed
  command id: dpm-trace-submit-d23224893203
  submission: 30f6ad7e-b9a0-4b60-9162-7496fea587ea
  update id:  -
  offset:     -
  status:     DAML_FAILURE
  message:    Interpretation error: Error: User failure: UNHANDLED_EXCEPTION/DA.Exception.PreconditionFailed:PreconditionFailed (error category 9): Template precondition violated: Asset {issuer = 'Issuer::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e', owner = 'Alice::1220e92d30a9b48e588f55405a4ab8e51a58a08d2ebd7864b58afb6082d5b489b47e', name = "GOLD", quantity = 0}
  trace:      no committed transaction tree is available for this completion
  category:   9 (gRPC 9)
  error id:   UNHANDLED_EXCEPTION/DA.Exception.PreconditionFailed:PreconditionFailed
  definite:   false
  rejected:   participant1
  trace id:   e840bfe483ccb95149ae0a3f225c5421
  corr id:    30f6ad7e-b9a0-4b60-9162-7496fea587ea
  exercised:
    in create command 760cbb88:Asset:Asset.
```
- `--export`: writes the raw rejection to a file.
- `--completion-file`: read a saved rejection from a JSON file.
