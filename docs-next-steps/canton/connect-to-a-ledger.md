---
sidebar_position: 7
title: 'Connect to a ledger with authentication and defaults'
description: 'Connect to a ledger with authentication and defaults'
---

The examples above use a local ledger without authentication, and repeat `--submitter` and `--read-as` in every command. This guide does not need the example ledger.
For a ledger that requires a token, pass `--token <token>`, or `--token-file <file>` to keep the token out of your shell history.
To stop repeating the options, put them in a `.dpm-trace.json` file in your project directory:
```bash
{
  "ledgerUrl": "http://localhost:6113",
  "readAs": "<party-id>",
  "tokenFile": "<path-to-token-file>"
}
```
`dpm trace` looks for the file in the current directory and its parents, and stops at the project root, the first directory that has a `.git` or a `daml.yaml`. Use `--config <file>` to point to a different file. `ledgerUrl` replaces `--submitter`, `readAs` replaces `--read-as`, and `token` and `tokenFile` replace `--token` and `--token-file`. Do not commit a file that holds a token.
Each setting also has an environment variable: `DPM_TRACE_LEDGER_URL`, `DPM_TRACE_READ_AS`, `DPM_TRACE_TOKEN` and `DPM_TRACE_TOKEN_FILE`. A flag wins over an environment variable, which wins over the config file.
When you trace an update on a different participant than the one that took the submission, the update may not have arrived yet. Add `--wait <seconds>` to retry until it is visible:
```bash
dpm trace <update-id> --submitter "$LEDGER2" --read-as "$BOB" --wait 10
```
