---
sidebar_position: 2
title: 'Find a command by its ID'
description: 'Find a command by its ID'
---

`dpm trace submit` generates a command ID for you, but you can set your own with `--command-id`. `--command-id` asks the participant's completions, so it finds commands that were accepted and commands rejected after sequencing. A command rejected before sequencing has no completion to find. Submit these two commands with your own command IDs:
```bash
# a command rejected before sequencing, because an Asset with quantity 0 breaks the template precondition
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --command-id zero-asset \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=0

# a command that succeeds
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --command-id create-gold-asset \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=100
```
Look up the one that failed:
```bash
dpm trace --command-id zero-asset --submitter "$LEDGER" --act-as "$ISSUER"
```
Output:
```bash
error: no completion for command 'zero-asset'.
A command rejected during interpretation never reaches the ledger, so it has no completion to look up; capture the rejection with `submit --export <file>` and read it with --completion-file <file>.
If the command was sequenced, it may be outside the queried window: widen it with --begin-exclusive or --completion-limit
```
`zero-asset` was rejected before sequencing, so there is no completion to find. Capture it with `--export` instead, as in [Trace a failed submission](./trace-a-failed-submission.md).

Now look up the one that succeeded:
```bash
dpm trace --command-id create-gold-asset --submitter "$LEDGER" --act-as "$ISSUER"
```
Output:
```bash
DPM trace completion
  result:     completion committed
  command id: create-gold-asset
  submission: 783a498c-e616-4bc2-9e26-7e08e2de111e
  update id:  122084694e3d88dbd6e0b18dace845dea25ae84b79084ee13ddedbd3dde56fda28ea
  offset:     28
  status:     0
  message:    -
  parties:    Issuer::12206747...278dc7
  source:     ledger-json-api
```
The completion is committed, and it gives the update ID of the command.
