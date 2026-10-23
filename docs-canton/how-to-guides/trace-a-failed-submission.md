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
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" \
  --arg name=GOLD --arg quantity=0
```
Output:
```bash
✗ submission failed  DAML_FAILURE
  'Interpretation error: Error: User failure: UNHANDLED_EXCEPTION/DA.Exception.PreconditionFailed:PreconditionFailed (error category 9): Template precondition violated: Asset {issuer = \'Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7\', owner = \'Alice::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7\', name = "GOLD", quantity = 0}'

  Command                                              (what you sent)
    create Asset:Asset  issuer=Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7  owner=Alice::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7  name=GOLD
    act-as Issuer::12206747...278dc7    command id dpm-trace-submit-...    offset -

  Next
    rerun with --export <file> to capture this rejection, then
    dpm trace compare --prepared <prepared.json> --completion-file <file>
```
The summary above is not saved anywhere. To keep the rejection, run the same command again with `--export`:
```bash
dpm trace submit \
  --submitter "$LEDGER" \
  --act-as "$ISSUER" \
  --template '#asset:Asset:Asset' \
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
  command id: dpm-trace-submit-97d437258fb3
  submission: 93d4044d-ceb1-48bc-b116-5b6063e37dbe
  update id:  -
  offset:     -
  status:     DAML_FAILURE
  message:    Interpretation error: Error: User failure: UNHANDLED_EXCEPTION/DA.Exception.PreconditionFailed:PreconditionFailed (error category 9): Template precondition violated: Asset {issuer = 'Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7', owner = 'Alice::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7', name = "GOLD", quantity = 0}
  trace:      no committed transaction tree is available for this completion
  category:   9 (gRPC 9)
  error id:   UNHANDLED_EXCEPTION/DA.Exception.PreconditionFailed:PreconditionFailed
  definite:   false
  rejected:   participant1
  trace id:   bee941221c6303f4dde66d700c14c027
  corr id:    93d4044d-ceb1-48bc-b116-5b6063e37dbe
  exercised:
    in create command bfffc530:Asset:Asset.
```
- `--export`: writes the raw rejection to a file.
- `--completion-file`: read a saved rejection from a JSON file.
