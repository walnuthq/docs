---
sidebar_position: 8
title: 'Run tests in CI'
description: 'Run tests in CI'
---

`dpm trace test` runs your Daml Script tests, prints each test's transaction tree, points every failure to the Daml line that caused it, and exits with a non-zero code when a test fails, so the CI job fails too.

It needs Daml Script tests and DPM installed. It does not need the example ledger. The examples below run it on [examples/asset](https://github.com/walnuthq/dpm-trace/tree/main/examples/asset), which keeps its templates in `daml/` and its Script tests in a separate `unittests/` package that depends on the asset DAR. `Asset` implements the Splice Token Standard `Holding` interface, and both packages pull the Splice DARs from GitHub as [git dependencies](https://github.com/walnuthq/dpm-trace/tree/main/examples#git-dar-dependencies) pinned to a commit, so they need DPM 1.1 or newer and SDK 3.6 or newer.

Fetch the git dependencies, then build both packages from the package directory:
```bash
dpm install package
(cd unittests && dpm install package)
dpm build --all
```
`dpm build` does not fetch git dependencies, so run `dpm install package` first on a new machine or CI runner. `dpm build --all` builds the asset DAR before the test package that depends on it.

Then run the tests in `unittests/`:
```bash
dpm trace test unittests --files daml/Test.daml --no-trees
```
`--files daml/Test.daml` runs only the tests in `daml/Test.daml`. The tests run with DPM. The `--no-trees` flag keeps the output to the summary and the failures:
```bash
DPM trace test
  package:  <package-dir>/unittests
  command:  dpm test --files daml/Test.daml
  result:   all 11 passed (11 total)

Results
  PASS  setup                       no transactions
  PASS  testAuthFail                2 tx  +1 create  !1 expected-fail
  PASS  testBadSplitFails           2 tx  +1 create  !1 expected-fail
  PASS  testCannotIssueZero         1 tx  !1 expected-fail
  PASS  testDoubleSpending          3 tx  +2 create  >1 exercise  x1 archive  !1 expected-fail
  PASS  testIssue                   1 tx  +1 create
  PASS  testSplit                   2 tx  +3 create  >1 exercise  x1 archive
  PASS  testStrangerCannotTransfer  2 tx  +1 create  !1 expected-fail
  PASS  testTransfer                2 tx  +2 create  >1 exercise  x1 archive
  PASS  testAssetIsHolding          1 tx  +1 create
  PASS  testDuplicateKey            3 tx  +3 create  >1 exercise  x1 archive  !1 expected-fail
```
The header shows:

- `package`: the package whose tests ran
- `command`: the `dpm test` command that `dpm trace test` ran
- `result`: how many tests passed and failed

Under `Results`, each line shows the test result, the test name and the number of transactions (`tx`), with the events they produced. `setup` is listed because every top-level `Script` in the file runs as a test, and it submits no transactions. The event markers are:

- `+`: create
- `>`: exercise
- `x`: archive
- `!`: a command that was expected to fail

To see how a failing test is reported, run `testOverSplitRejected` from `daml/FailureDemo.daml`, a test that fails on purpose by splitting an asset with `splitQuantity = 0`:
```bash
dpm trace test unittests --files daml/FailureDemo.daml -p testOverSplitRejected \
  --daml-yaml unittests/daml.yaml --daml-yaml daml.yaml \
  --dar .daml/dist/asset-1.0.0.dar --no-trees
```
The assertion that rejects the split is in the asset package, not in `unittests/`, so the command passes both `daml.yaml` files and the asset DAR. `--daml-yaml` replaces the default, so list both.

Output:
```bash
  FAIL  testOverSplitRejected
        message: Script execution failed on commit at FailureDemo:27:8: Failed with status: UNHANDLED_EXCEPTION/DA.Exception.AssertionFailed:AssertionFailed: splitQuantity must be between 1 and quantity - 1 Using Canton Error Category InvalidGivenCurrentSystemStateOther
        <package-dir>/unittests/daml/FailureDemo.daml:27:8
        basis: daml test: FailureDemo
          25 |   cid <- submit issuer do
          26 |     createCmd Asset with issuer; owner = alice; name = "GOLD"; quantity = 100
        > 27 |   _ <- submit alice do
                      ^
          28 |     exerciseCmd cid Split with splitQuantity = 0
          29 |   pure ()
        <package-dir>/daml/Asset.daml:41:20
        basis: damlc inspect: Asset
          39 |       controller owner
          40 |       do
        > 41 |         assertMsg "splitQuantity must be between 1 and quantity - 1"
                                  ^
          42 |           (splitQuantity > 0 && splitQuantity < quantity)
          43 |         kept <- create this with quantity = quantity - splitQuantity
```
`message` is the error. The first snippet is the command that was submitted, and the second is the assertion in `Asset.daml` that rejected it, confirmed in the compiled DAR by `damlc inspect`. Without the two `--daml-yaml` flags and `--dar`, only the first snippet is printed:
```bash
dpm trace test unittests --files daml/FailureDemo.daml -p testOverSplitRejected --no-trees
```
Output:
```bash
DPM trace test
  package:  <package-dir>/unittests
  command:  dpm test --test-pattern testOverSplitRejected --files daml/FailureDemo.daml
  result:   1 failed, 0 passed, 1 total

Results
  FAIL  testOverSplitRejected
        message: Script execution failed on commit at FailureDemo:27:8: Failed with status: UNHANDLED_EXCEPTION/DA.Exception.AssertionFailed:AssertionFailed: splitQuantity must be between 1 and quantity - 1 Using Canton Error Category InvalidGivenCurrentSystemStateOther
        <package-dir>/unittests/daml/FailureDemo.daml:27:8
        basis: daml test: FailureDemo
          25 |   cid <- submit issuer do
          26 |     createCmd Asset with issuer; owner = alice; name = "GOLD"; quantity = 100
        > 27 |   _ <- submit alice do
                      ^
          28 |     exerciseCmd cid Split with splitQuantity = 0
          29 |   pure ()
```

Without `--no-trees` the command also prints the transaction tree of every test after the results. Because `Asset` comes from another package, the tree names it with its package ID. To print the tree of `testSplit` only:
```bash
dpm trace test unittests --files daml/Test.daml -p testSplit
```
Output:
```bash
Transaction trees

  ── testSplit ──
  Transactions:
    TX 0 1970-01-01T00:00:00Z (Test:51:10)
    #0:0
    │   consumed by: #1:0
    │   referenced by #1:0
    │   disclosed to (since): 'Alice-9b3970be' (0), 'Issuer-d4d95138' (0)
    └─> 'Issuer-d4d95138' creates Asset:Asset@<package-id>
                          with
                            issuer = 'Issuer-d4d95138'; owner = 'Alice-9b3970be'; name = "GOLD"; quantity = 100

    TX 1 1970-01-01T00:00:00Z (Test:53:20)
    #1:0
    │   disclosed to (since): 'Alice-9b3970be' (1), 'Issuer-d4d95138' (1)
    └─> 'Alice-9b3970be' exercises Split on #0:0 (Asset:Asset@<package-id>)
                         with
                           splitQuantity = 30
        children:
        #1:1
        │   disclosed to (since): 'Alice-9b3970be' (1), 'Issuer-d4d95138' (1)
        └─> 'Issuer-d4d95138' creates Asset:Asset@<package-id>
                              with
                                issuer = 'Issuer-d4d95138'; owner = 'Alice-9b3970be'; name = "GOLD"; quantity = 70

        #1:2
        │   disclosed to (since): 'Alice-9b3970be' (1), 'Issuer-d4d95138' (1)
        └─> 'Issuer-d4d95138' creates Asset:Asset@<package-id>
                              with
                                issuer = 'Issuer-d4d95138'; owner = 'Alice-9b3970be'; name = "GOLD"; quantity = 30

  Active contracts:  #1:1, #1:2

  Return value: {}
```
The command exits with a non-zero code when a test fails or cannot run, so a CI job fails in both cases. The exit codes and the other flags are listed under `test` in [Commands](../reference/commands.md).

To run it in GitHub Actions, install DPM and the Daml SDK, fetch the git dependencies, build both DARs, and call `dpm-trace test` as a step:
```yaml
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    env:
      LANG: C.UTF-8
      LC_ALL: C.UTF-8
    steps:
      - uses: actions/checkout@v4
      - name: Install DPM and the Daml SDK
        run: |
          curl -sSL https://get.digitalasset.com/install/install.sh | sh -s 3.7.1
          echo "$HOME/.dpm/bin" >> "$GITHUB_PATH"
      - name: Fetch git dependencies
        run: |
          dpm install package
          (cd unittests && dpm install package)
          dpm update --check
      - name: Build the DARs
        run: dpm build --all
      - name: Run Daml Script tests
        run: |
          dpm-trace test unittests \
            --files daml/Test.daml \
            --daml-yaml unittests/daml.yaml \
            --daml-yaml daml.yaml \
            --dar .daml/dist/<package>.dar \
            --junit dpm-trace-results.xml \
            --no-trees
```
In this workflow:

- `dpm install package`: fetches the git dependencies into the DPM cache. `dpm update --check` fails the job if one is not pinned to a commit.
- `dpm build --all`: builds the package DAR and the `unittests/` package that depends on it.
- `--daml-yaml` and `--dar`: point failures to the assertion in the package under test and check them against its compiled DAR.
- `--junit`: writes JUnit XML for the CI system.
- `LANG` and `LC_ALL`: set to `C.UTF-8`, because `daml test` writes Unicode into its output and aborts under a non-UTF-8 locale.

The `dpm-trace` binary must be on the `PATH` of the job, so add a step that downloads the release binary as described in [Install](../install.md).

To test against a real ledger instead of the in-memory one, you need:

- [`lit`](https://pypi.org/project/lit/)
- [`FileCheck`](https://pypi.org/project/filecheck/)

To boot a local Canton, which is the default, you also need a Canton JAR, which DPM keeps under `~/.dpm/cache/components/canton-open-source/<sdk-version>/lib/`, and Java 17 or newer. Attaching to participants that are already running needs no local Canton JAR. The example builds the DAR, which needs Java for that step; pass `--dar <file>` to use a prebuilt DAR.

Then run the suite with `--integration`. It starts a local Canton, runs a `lit` suite against it, and stops it. The suite directory, here `itests`, must exist in the package directory and contain a `lit.cfg.py`. `--parties Name@N` places each party on participant `N`, so `Alice@1,Bob@2` puts `Alice` on participant 1 and `Bob` on participant 2:
```bash
dpm trace test . --integration itests \
  --canton-jar <path-to-canton.jar> \
  --parties Alice@1,Bob@2
```
Output:
```bash
building DAR ...
booting local Canton (participant1 :51505, participant2 :51508); deploying asset-1.0.0.dar ...
Canton ready: Alice=Alice::122031e3...3d38be, Bob=Bob::122040eb...00e6a8
running integration suite: <package-dir>/itests

-- Testing: 1 tests, 1 workers --
PASS: dpm-trace-integration :: asset-create.test (1 of 1)

Testing Time: 1.30s

Total Discovered Tests: 1
  Passed: 1 (100.00%)
```
The command builds the DAR of the package directory, which does not include `unittests/` and so does not upload `daml-script`, starts Canton with `Alice` on participant 1 and `Bob` on participant 2, runs every test in `itests` against it, and stops Canton when the suite ends.

To run the same suite against participants that are already running, such as a shared test network, pass `--ledger-url` instead of `--canton-jar`. Repeat it once per participant, so the count is the highest `N` in `--parties`, and pass one `--token-file` per URL in the same order:
```bash
dpm trace test . --integration itests \
  --parties Alice@1,Bob@2 \
  --ledger-url https://<participant1-json-api-url> --token-file ./token1.txt \
  --ledger-url https://<participant2-json-api-url> --token-file ./token2.txt
```
Attach mode works as follows:

- Only `--ledger-url` on the command line turns it on, never `DPM_TRACE_LEDGER_URL` or `.dpm-trace.json`, so a configuration written for `dpm trace` cannot send a test run to a real network. It cannot be combined with `--canton-jar`.
- Each `--ledger-url` must be an `http` or `https` URL with a host and no `user:password@`. Credentials in a URL are rejected, and never echoed, in favour of `--token-file`. So are a query (`?`) and a fragment (`#`), which are not echoed either, because the API paths are appended to the URL as text. `--canton-jar` is an error with `--ledger-url`, even an empty one. A `DPM_TRACE_CANTON_JAR` in the environment is ignored.
- `--token-file` is optional, but if you pass it, pass exactly one per `--ledger-url`. Without a token file, a participant is treated as unauthenticated: it has no user, so no rights are granted or revoked. A `--token-file` without `--ledger-url`, an empty `--ledger-url`, and a token file that is unreadable or empty are errors, reported before the DAR is built. The file is read again on every request, so a CI job can refresh an expiring token. A suite command that outlives its token, such as `trace --wait`, reads the file once when it starts and not again while it waits. Replace the file by renaming a new file over it, so a request never reads a half-written token.
- The setup goes through the JSON Ledger API. It uploads the DAR and allocates the parties, with a per-run suffix on their names so that repeated runs on the same network do not collide. It then grants the token's user the rights to act and read as those parties. With tokens, that user needs participant admin rights.
- The granted rights are revoked when the run ends, including after a test failure or on `SIGINT`, `SIGTERM`, or `SIGHUP`, or when the output of `dpm trace` closes, for example under `| head`. In that last case the runner's own write gets `EPIPE`, so it revokes the rights and cleans up, and then exits with 141. If the output closes while lit is running, lit 23.1.6 can hang and the rights stay until the run receives a signal, so do not pipe a long run into a command that exits early. A bare `SIGPIPE` raised by a participant that closes a connection early is ignored. A grant request that was already sent is allowed to finish, for up to 30 seconds. If it times out or ends without a usable answer, the participant may still apply it after the revoke has run, so the run revokes anyway and prints a warning that names the user, the parties and the participant as possibly still granted. If a revoke fails, a warning on stderr names the user and parties to clean up. `SIGKILL` cannot be caught, so a killed run leaves its rights behind and you must revoke them by hand. The parties and the DAR stay on the network.
- `--canton-timeout` is one deadline per party, across all participants, for the party to become visible on each of them. `--keep-artifacts` and `--sequencer-type` are ignored.
- If you change the DAR, bump `version` in `daml.yaml` and rebuild. Canton refuses a package whose name and version it already has with different content, and `dpm trace` then asks you to bump the version. The change must stay upgrade-compatible.
- The suite's commands run with the project config minus its `token`, `tokenFile`, `ledgerUrl` and `scanUrl` keys, and without any `DPM_TRACE_IT_*`, `DPM_TRACE_TOKEN*`, `DPM_TRACE_LEDGER_URL` or `DPM_TRACE_SCAN_URL` variable the runner did not set. In both modes, an inherited `DPM_TRACE_IT_TOKEN_FILE*` is dropped, so a stale token path can never become a `--token-file` flag. `DPM_TRACE_CONFIG` is read by every `dpm trace` command when it looks for its configuration, but the runner sets it only in attach mode, to the copy of the project config without those keys. This needs the suite's `lit.cfg.py` to forward `DPM_TRACE_CONFIG`, as the generated one does. The check is a best-effort guard. It reads the one lit configuration that lit would execute, the first that exists of `lit.site.cfg.py`, `lit.site.cfg`, `lit.cfg.py` and `lit.cfg` in the nearest directory that has any, starting at the test directory and going up, and looks for an uncommented mention of `DPM_TRACE_CONFIG`. It does not run the configuration. A suite whose configuration does not mention it, such as one created before attach mode, is refused with exit code 2 and the lines to add, before anything is uploaded. So is a suite with no lit configuration at all, because it cannot be isolated. The guard judges only the suite's own configuration. lit also loads the configuration of any nested suite below it, and the guard does not read those, so every nested suite with its own lit configuration must forward `DPM_TRACE_CONFIG` too.
- Every token file is exported to the suite as `DPM_TRACE_IT_TOKEN_FILE`, `DPM_TRACE_IT_TOKEN_FILE2`, `DPM_TRACE_IT_TOKEN_FILE3` and so on. The generated `lit.cfg.py` defines only `%auth` and `%auth2`, so a suite with more participants adds its own substitutions for the rest.

In the tests, `%ledger` and `%auth` stand for participant 1, and `%ledger2` and `%auth2` for participant 2. `%auth` expands to `--token-file "$DPM_TRACE_IT_TOKEN_FILE"`, and `%auth2` to the same with `DPM_TRACE_IT_TOKEN_FILE2`. Both expand to nothing when there is no token file or the suite runs against a local Canton. The path travels in the environment of the test commands, so a path that contains text `lit` substitutes, such as `%alice`, arrives unchanged. Pass them next to `--submitter`:
```bash
%dpm submit --submitter %ledger2 %auth2 ...
```
In GitHub Actions, point the step at an existing participant and read the token from a file written by an earlier step:
```yaml
      - name: Run integration tests
        run: |
          dpm-trace test . --integration itests \
            --parties Alice@1 \
            --ledger-url "$LEDGER_URL" \
            --token-file "$RUNNER_TEMP/token.txt"
```
If you have no participant to attach to, the [LocalNet](https://github.com/peacefulstudio/canton-localnet) project provides a GitHub Action that starts one.
