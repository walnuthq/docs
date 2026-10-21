---
sidebar_position: 1
title: 'Commands'
description: 'Every dpm trace command and flag'
---

Each subcommand has one entry below, and the full `dpm trace --help` output is at the end of this section.

**`trace`**

Inspect a successful transaction by update ID, or a failed submission through its completion data.
```bash
dpm trace <update-id> --submitter <url> --read-as <party>
dpm trace --command-id <id> --submitter <url> --act-as <party>
dpm trace --completion-file <file>
```
Add `--visualize` to step through the result, `--export <file>` to save it, and `--print-json` to print the normalized trace as JSON.

**`submit`**

Submit a command and print the update ID. On failure, it prints the rejection, and `--export <file>` saves it.
```bash
dpm trace submit --submitter <url> --act-as <party> \
  --template '#package:Module:Template' --arg <field>=<value>
```
Add `--choice <name>` and `--contract-id <id>` to exercise a choice, and `--command-id <id>` to set the command ID yourself.

**`prepare`**

Show what a command would do, without committing it. Takes the same command flags as `submit`. `--export <file>` saves the prepared artifact.

**`open`**

Reopen an exported trace or prepared artifact, without a ledger. Add `--visualize` to step through it.
```bash
dpm trace open <file>
```

**`compare`**

Compare two updates, a prepared command and an update, or a prepared command and a completion.
```bash
dpm trace compare <baseline-update-id> <candidate-update-id> --submitter <url> --read-as <party>
dpm trace compare --prepared <file> --update <update-id> --submitter <url> --read-as <party>
dpm trace compare --prepared <file> --completion-file <file>
```

**`test`**

Run Daml Script tests, print the transaction tree of each one, and exit non-zero when a test fails, as shown in [Run tests in CI](../how-to-guides/run-tests-in-ci.md).
```bash
dpm trace test <package-dir> --daml dpm
```

| Flag | What it does |
| --- | --- |
| `--daml <toolchain>` | Runs the tests with `daml`, `damlc` or `dpm`. It defaults to `daml`. |
| `-p <pattern>`, `--test-pattern <pattern>` | Runs only the tests that match the pattern. |
| `--files <path>` | Restricts the run to specific source files. It can be repeated. |
| `--no-trees` | Prints only the summary and the failures, which keeps CI logs short. |
| `--junit <file>` | Also writes JUnit XML for the CI system. |
| `--print-json` | Prints the `dpm-trace/test-report/v0` JSON report and exits. |
| `--dar <file>` | Checks the failure text against the compiled package with `damlc inspect`. |
| `--integration <dir>` | Starts a local Canton, runs the `lit` suite in the directory against it and stops it. |
| `--canton-jar <file>` | Sets the Canton JAR that `--integration` starts. |
| `--parties Name@N` | Places each party on participant `N`, for example `Alice@1,Bob@2`. It can list several parties separated by commas. |

The command exits with 0 when every test passes, 1 when a test fails, and 2 when it cannot run, for example, when the toolchain is missing.

**`install-plugin`**

Register the binary with DPM so `dpm trace` works.
```bash
dpm-trace install-plugin
```

<details>
<summary>Full `dpm trace --help` output</summary>

```bash
dpm-trace inspects participant-scoped Canton transactions.

Usage:
  dpm trace <update-id> [flags]
  dpm trace --command-id <id> [flags]
  dpm trace --completion-file <file> [flags]
  dpm trace <command> [flags]

Commands:
  open             Reopen an exported trace or prepared artifact.
  compare          Compare prepared transactions, updates, or completions.
  prepare          Prepare a command without committing it.
  submit           Submit a command and print the resulting update id.
  install-plugin   Register this binary as a DPM component.

Flags:
  --submitter URL            Ledger JSON API base URL. Alias of --ledger-url, --participant-url.
  --scan-url URL             Scan API base URL, e.g. https://.../api/scan.
  --read-as PARTY            Party to read as. Repeatable. Alias of --party.
  --token TOKEN              Bearer token for the Ledger JSON API.
  --token-file PATH          Bearer token file. Alias of --access-token-file.
  --completion-file PATH     Inspect a captured completion instead of an update.
  --daml-yaml PATH           daml.yaml for local source diagnostics. Repeatable.
  --dar PATH                 Local DAR, verified with damlc inspect. Repeatable.
  --damlc PATH               damlc or daml executable for inspection. Defaults to daml.
  --debug-info PATH          daml-debug-info/v1 file for source positions. Repeatable.
  --wait SECONDS             Retry while the update is not yet visible on this participant.
  --visualize                Open the interactive visualizer over the trace.
  --export PATH              Write a portable trace artifact. Alias of --out.
  --print-json               Print the normalized trace JSON and exit.
  --source MODE              auto, scan or ledger. Defaults to auto.
  --source-root PATH         Local Daml source root for diagnostics. Repeatable.
  --log-file PATH            Operator log to correlate with the completion. Repeatable.
  --command-id ID            Look up a failed submission by command id.
  --begin-exclusive N        Offset to search completions from. Defaults to 0.
  --completion-limit N       Completions to search. Defaults to 100.
  --max-source-locations N   Maximum diagnostics to resolve. Defaults to 5.
  --explain-apis             Explain Scan API vs Ledger API.
  --config PATH              Config JSON. Defaults to .dpm-trace.json in this directory or a parent.
  --color MODE               auto, always or never. Defaults to auto.
  -h, --help                 Show this help.

Examples:
  dpm trace <update-id> --submitter http://localhost:7575 --read-as '<party>'
  dpm trace open trace.json --visualize
  dpm trace --completion-file completion.json --daml-yaml ./daml.yaml
  dpm trace compare --prepared prepared.json --update <update-id>
  dpm trace <update-id> --export trace.json

Output is participant-scoped: it is one participant's projection, not a
global Canton transaction. A failed submission has no update id, so those
workflows use completion data instead.
```

</details>
