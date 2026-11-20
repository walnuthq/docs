---
sidebar_position: 4
title: 'Configuration'
description: 'Config file and environment variables for dpm trace'
---

Set the connection options once in a config file or in environment variables, instead of passing them on every command.

## Config file

`dpm trace` reads a `.dpm-trace.json` file:
```json
{
  "ledgerUrl": "https://participant.example.com",
  "readAs": "<party-id>",
  "tokenFile": "<path-to-token-file>"
}
```
`dpm trace` looks for the file in the current directory. If the current directory or a parent contains `.git`, `daml.yaml` or `component.yaml`, it also looks in each parent directory up to the nearest one that does, and stops there.

To use a file in another location, pass `--config <file>`. Otherwise `DPM_TRACE_CONFIG` names the file, then the search above applies. `DPM_TRACE_CONFIG` is the integration runner's override, not a setting for users: in attach mode (`test --integration --ledger-url`) it points at a copy of the project config without `token`, `tokenFile`, `ledgerUrl` and `scanUrl`, so those reach test commands only through the flags a suite passes them. The other keys, such as `readAs`, `party`, `damlYaml` and `sourceRoots`, still apply. Like `--config`, a `DPM_TRACE_CONFIG` that cannot be read is an error.

:::warning
If the file holds a token, do not commit it.
:::

With the file in place, the command is shorter:
```bash
dpm trace <update-id>
```

## Settings

| Config key | Flag | Environment variable |
| --- | --- | --- |
| `ledgerUrl` | `--submitter` | `DPM_TRACE_LEDGER_URL` |
| `readAs` | `--read-as` | `DPM_TRACE_READ_AS` |
| `token` | `--token` | `DPM_TRACE_TOKEN` |
| `tokenFile` | `--token-file` | `DPM_TRACE_TOKEN_FILE` |

If you set the same option in more than one place, `dpm trace` uses the flag first, then the environment variable, then the config file.
