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

## Find a command rejected after sequencing

A command rejected after sequencing has a completion, so `--command-id` finds it. One way to get such a rejection is to submit two commands that consume the same contract at the same time. The first one locks the contract, and the participant rejects the second with `LOCAL_VERDICT_LOCKED_CONTRACTS`. Create an asset for the two commands to use:
```bash
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=RACE --arg quantity=10
```
Trace it with `--print-json`, using the update ID it printed:
```bash
dpm trace <update-id> --submitter "$LEDGER" --read-as "$ISSUER" --print-json
```
Copy the value of the `contractId` line, then submit two transfers of that contract at the same time:
```bash
for id in race-a race-b; do
  dpm trace submit --submitter "$LEDGER" --act-as "$ALICE" \
    --command-id "$id" \
    --template '#asset:Asset:Asset' --choice Transfer \
    --contract-id <contract-id> \
    --arg newOwner="$BOB" &
done
wait
```
One transfer commits and prints its update ID. The other is rejected:
```bash
✗ submission failed  LOCAL_VERDICT_LOCKED_CONTRACTS
  'Rejected transaction is referring to locked contracts '

  Command                                              (what you sent)
    exercise Asset:Asset:Transfer on 006bbff...  newOwner=Bob::12206f5e34dacf518ca87d87e1fddc5eee2be0f9f879e1694620b51e44a4a976d831
    act-as Alice::12206747...278dc7    command id race-a    offset -

  Next
    rerun with --export <file> to capture this rejection, then
    dpm trace compare --prepared <prepared.json> --completion-file <file>
```
Either command can be the one rejected, and if the first transfer commits before the second one is interpreted, the second fails before sequencing with `CONTRACT_NOT_FOUND` and has no completion, so create a new asset and run both transfers again.

Look up the rejected command:
```bash
dpm trace --command-id race-a --submitter "$LEDGER" --act-as "$ALICE"
```
Output:
```bash
DPM trace completion
  result:     completion failed
  command id: race-a
  submission: cbe50c34-0336-4e15-a699-e9180f07f749
  update id:  -
  offset:     32
  status:     10
  message:    LOCAL_VERDICT_LOCKED_CONTRACTS(2,bea681f9): Rejected transaction is referring to locked contracts 
  parties:    Alice::12206747...278dc7
  source:     ledger-json-api
  trace:      no committed transaction tree is available for this completion
```
The command failed, but it was sequenced, so the participant has its completion. There is no update ID, because nothing was committed.

## Reuse a command ID

A command that reuses a command ID with the same act-as party is rejected before sequencing with `DUPLICATE_COMMAND`. Submit the `create-gold-asset` command from above again:
```bash
dpm trace submit --submitter "$LEDGER" --act-as "$ISSUER" \
  --command-id create-gold-asset \
  --template '#asset:Asset:Asset' \
  --arg issuer="$ISSUER" --arg owner="$ALICE" --arg name=GOLD --arg quantity=100
```
Output:
```bash
✗ submission failed  DUPLICATE_COMMAND
  'Command submission already exists.'

  Command                                              (what you sent)
    create Asset:Asset  issuer=Issuer::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7  owner=Alice::12206747c65243c1f7fc92787d5c7d0af50006b160c6231ef19a9125054453278dc7  name=GOLD
    act-as Issuer::12206747...278dc7    command id create-gold-asset    offset -

  Next
    rerun with --export <file> to capture this rejection, then
    dpm trace compare --prepared <prepared.json> --completion-file <file>
```
Look up the command ID again:
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
The output is the same as before: the lookup finds the original command, not the rejection. To keep the rejection, use `submit --export <file>`.

For which failures have a completion, see the table under `trace` in [Commands](../reference/commands.md). For what each error code means, see [Canton error codes](https://docs.canton.network/global-synchronizer/reference/error-codes).
