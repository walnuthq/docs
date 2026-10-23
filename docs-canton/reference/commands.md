---
sidebar_position: 1
title: 'Commands'
description: 'Every dpm trace command and flag'
---

Each subcommand has one entry below, and the full `dpm trace --help` and `dpm trace test --help` output is at the end of this section.

**`trace`**

Inspect a successful transaction by update ID, or a failed submission through its completion data.
```bash
dpm trace <update-id> --submitter <url> --read-as <party>
dpm trace --command-id <id> --submitter <url> --act-as <party>
dpm trace --completion-file <file>
```
Add `--visualize` to step through the result, `--export <file>` to save it, and `--print-json` to print the normalized trace as JSON.

`--command-id` searches the participant's completions, so it only finds a failed command that was sequenced. `--completion-file` reads a rejection saved with `submit --export <file>`, so it works for every failure.

| Failure | Example | `--command-id` | `--completion-file` |
| --- | --- | --- | --- |
| Before sequencing | a failed `assert` (`DAML_FAILURE`), `CONTRACT_NOT_FOUND`, missing authorization, a reused command ID (`DUPLICATE_COMMAND`) | no completion | yes |
| After sequencing | the contract is locked by another command (`LOCAL_VERDICT_LOCKED_CONTRACTS`), the contract was archived by another command, a mediator timeout | yes | yes |

The error codes come from Canton, and `dpm trace` prints them as the participant returns them. For the full list, see [Canton error codes](https://docs.canton.network/global-synchronizer/reference/error-codes).

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
dpm trace test <package-dir>
```

| Flag | What it does |
| --- | --- |
| `--daml <toolchain>` | Runs the tests with `dpm`, `daml` or `damlc`. It defaults to `dpm`. |
| `-p <pattern>`, `--test-pattern <pattern>` | Runs only the tests that match the pattern. |
| `--files <path>` | Restricts the run to specific source files. It can be repeated. |
| `--no-trees` | Prints only the summary and the failures, which keeps CI logs short. |
| `--junit <file>` | Also writes JUnit XML for the CI system. |
| `--print-json` | Prints the `dpm-trace/test-report/v0` JSON report and exits. |
| `--daml-yaml <file>` | Sets the `daml.yaml` whose sources are searched for failure locations. It can be repeated and defaults to the package's. |
| `--source-root <path>` | Adds a local Daml source root for failure locations. It can be repeated. |
| `--debug-info <file>` | Reads source positions from a `daml-debug-info/v1` file. It can be repeated. |
| `--dar <file>` | Checks the failure text against the compiled package with `damlc inspect`. It can be repeated. With `--integration`, deploys the first DAR instead of building one. |
| `--damlc <path>` | Sets the `dpm`, `daml` or `damlc` executable that inspects the DAR. It defaults to the `--daml` value. |
| `--max-source-locations <n>` | Sets the maximum number of source locations per failure. It defaults to 6. |
| `--keep-artifacts` | Keeps the temporary run directory. |
| `--integration <dir>` | Starts a local Canton, runs the integration tests in the directory against it and stops it. |
| `--canton-jar <file>` | Sets the Canton JAR that `--integration` starts. It defaults to `$DPM_TRACE_CANTON_JAR`. |
| `--parties Name@N` | Places each party on participant `N`, for example `Alice@1,Bob@2`. It can list several parties separated by commas. It defaults to `Alice,Bob`. |
| `--lit <path>` | Sets the `lit` executable that `--integration` runs. It defaults to `lit`. |
| `--sequencer-type <type>` | Sets the sequencer type of the local Canton. It defaults to `bft`. |
| `--canton-timeout <seconds>` | Sets how long to wait for the local Canton to be ready. It defaults to 180. |
| `--verbose` | Passes `-vv` to `lit` so each test prints its output. |
| `--init` | Creates `itests/`, `unittests/` and a CI workflow in the package instead of running tests. |
| `--no-unittests` | With `--init`, skips `unittests/`. |
| `--no-ci` | With `--init`, skips the CI workflow. |
| `--itests-dir <dir>` | With `--init`, sets the integration test directory. It defaults to `itests`. |
| `--unittests-dir <dir>` | With `--init`, sets the unit test directory. It defaults to `unittests`. |

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
  test             Run Daml Script tests, or integration tests against a local Canton.
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
  --damlc PATH               dpm, daml or damlc executable for inspection. Defaults to dpm.
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

<details>
<summary>Full `dpm trace test --help` output</summary>

```bash
Run Daml Script unit tests, or lit integration tests against a local Canton, and map failures to source.

Usage:
  dpm trace test <package-dir> [flags]

Flags:
  --daml PATH                Toolchain to run: dpm, daml or damlc. Defaults to dpm.
  -p, --test-pattern PAT     Run only tests matching a pattern.
  --files PATH               Restrict to specific source files. Repeatable.
  --junit PATH               Also write JUnit XML for CI.
  --print-json               Print the dpm-trace/test-report/v0 report and exit.
  --no-trees                 Summary and failures only, for compact CI logs.
  --daml-yaml PATH           daml.yaml for source diagnostics. Repeatable. Defaults to the package's.
  --source-root PATH         Local Daml source root for diagnostics. Repeatable.
  --debug-info PATH          daml-debug-info/v1 file for source positions. Repeatable.
  --max-source-locations N   Maximum diagnostics per failure. Defaults to 6.
  --keep-artifacts           Keep the temporary run directory.
  --dar PATH                 Local DAR to verify failures with damlc inspect. Repeatable.
  --damlc PATH               dpm, daml or damlc executable for inspection. Defaults to --daml.
  --integration DIR          Run the integration tests in DIR against a local Canton that dpm trace starts and stops.
  --canton-jar PATH          Canton JAR to start for --integration. Defaults to $DPM_TRACE_CANTON_JAR.
  --dar PATH                 With --integration, deploy the first DAR instead of building.
  --parties Name@N,...       Parties to allocate and the participant each is placed on, e.g. Alice@1,Bob@2. Defaults to Alice,Bob.
  --lit PATH                 lit executable for --integration. Defaults to lit.
  --sequencer-type TYPE      Sequencer type of the local Canton. Defaults to bft.
  --canton-timeout SECONDS   How long to wait for the local Canton to be ready. Defaults to 180.
  --verbose                  Pass -vv to lit for per-test output.
  --init                     Scaffold itests/, unittests/ and a CI workflow in the package instead of running tests.
  --no-unittests             With --init, skip unittests/.
  --no-ci                    With --init, skip the CI workflow.
  --itests-dir DIR           With --init, the integration test directory. Defaults to itests.
  --unittests-dir DIR        With --init, the unit test directory. Defaults to unittests.
  --config PATH              Config JSON. Defaults to .dpm-trace.json in this directory or a parent.
  --color MODE               auto, always or never. Defaults to auto.
  -h, --help                 Show this help.
```

</details>
