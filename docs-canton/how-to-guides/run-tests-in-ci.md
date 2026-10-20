---
sidebar_position: 8
title: 'Run tests in CI'
description: 'Run tests in CI'
---

`dpm trace test` runs your Daml Script tests, prints each test's transaction tree, points every failure to the Daml line that caused it, and exits with a non-zero code when a test fails, so the CI job fails too.

It needs a Daml package with Script tests and DPM installed. It does not need the example ledger.

Run the tests from the package directory:
```bash
dpm trace test . --daml dpm --no-trees
```
The `--daml dpm` flag runs the tests with DPM, because without it `dpm trace test` looks for a `daml` executable and fails with `could not run "daml"` when only DPM is installed. The `--no-trees` flag keeps the output to the summary and the failures:
```bash
DPM trace test
  package:  <package-dir>
  command:  dpm test
  result:   1 failed, 3 passed, 4 total

Results
  PASS  testCannotIssueZero  1 tx  !1 expected-fail
  PASS  testSplit            2 tx  +3 create  >1 exercise  x1 archive
  FAIL  testSplitTooMuch
        message: Script execution failed on commit at Asset:123:3: Failed with status: UNHANDLED_EXCEPTION/DA.Exception.AssertionFailed:AssertionFailed: splitQuantity must be between 1 and quantity - 1 Using Canton Error Category InvalidGivenCurrentSystemStateOther
        <package-dir>/daml/Asset.daml:123:3
        basis: daml test: Asset
          121 |   cid <- submit issuer do
          122 |     createCmd Asset with issuer; owner = alice; name = "GOLD"; quantity = 100
        > 123 |   submit alice do
                  ^
          124 |     exerciseCmd cid Split with splitQuantity = 100
          125 |   pure ()
        <package-dir>/daml/Asset.daml:40:20
        basis: local source
          38 |       controller owner
          39 |       do
        > 40 |         assertMsg "splitQuantity must be between 1 and quantity - 1"
                                  ^
          41 |           (splitQuantity > 0 && splitQuantity < quantity)
          42 |         kept <- create this with quantity = quantity - splitQuantity
  PASS  testTransfer         2 tx  +2 create  >1 exercise  x1 archive
```
Each line shows the test result and the number of transactions, with the events they produced:

- `+`: create
- `>`: exercise
- `x`: archive
- `!`: a command that was expected to fail

For a failed test, `message` is the error. The code snippets point to the Daml line where the command was submitted (`Asset.daml:123:3`) and to the assertion that rejected it (`Asset.daml:40:20`).

Without `--no-trees` the command also prints the transaction tree of every test after the results, for example, this one for `testSplit`:
```bash
Transaction trees

  ── testSplit ──
  Transactions:
    TX 0 1970-01-01T00:00:00Z (Asset:85:10)
    #0:0
    │   consumed by: #1:0
    │   referenced by #1:0
    │   disclosed to (since): 'Alice-1df42503' (0), 'Issuer-4f1df03a' (0)
    └─> 'Issuer-4f1df03a' creates Asset:Asset
                          with
                            issuer = 'Issuer-4f1df03a'; owner = 'Alice-1df42503'; name = "GOLD"; quantity = 100

    TX 1 1970-01-01T00:00:00Z (Asset:87:20)
    #1:0
    │   disclosed to (since): 'Alice-1df42503' (1), 'Issuer-4f1df03a' (1)
    └─> 'Alice-1df42503' exercises Split on #0:0 (Asset:Asset)
                         with
                           splitQuantity = 30
        children:
        #1:1
        │   disclosed to (since): 'Alice-1df42503' (1), 'Issuer-4f1df03a' (1)
        └─> 'Issuer-4f1df03a' creates Asset:Asset
                              with
                                issuer = 'Issuer-4f1df03a'; owner = 'Alice-1df42503'; name = "GOLD"; quantity = 70

        #1:2
        │   disclosed to (since): 'Alice-1df42503' (1), 'Issuer-4f1df03a' (1)
        └─> 'Issuer-4f1df03a' creates Asset:Asset
                              with
                                issuer = 'Issuer-4f1df03a'; owner = 'Alice-1df42503'; name = "GOLD"; quantity = 30

  Active contracts:  #1:1, #1:2

  Return value: {}
```
The command exits with a non-zero code when a test fails or cannot run, so a CI job fails in both cases. The exit codes and the other flags are listed under `test` in [Commands](../reference/commands.md).

To run it in GitHub Actions, install DPM and the Daml SDK, build the DAR, and call `dpm-trace test` as a step:
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
          curl -sSL https://get.digitalasset.com/install/install.sh | sh -s 3.5.1
          echo "$HOME/.dpm/bin" >> "$GITHUB_PATH"
      - name: Build the DAR
        run: dpm build
      - name: Run Daml Script tests
        run: |
          dpm-trace test . \
            --daml dpm \
            --dar .daml/dist/<package>.dar \
            --junit dpm-trace-results.xml \
            --no-trees
```
In this workflow:

- `--dar`: checks the failure text against the compiled package.
- `--junit`: writes JUnit XML for the CI system.
- `LANG` and `LC_ALL`: set to `C.UTF-8`, because `daml test` writes Unicode into its output and aborts under a non-UTF-8 locale.

The `dpm-trace` binary must be on the `PATH` of the job, so add a step that downloads the release binary as described in [Install](../install.md).

To test against a real ledger instead of the in-memory one, you need:

- A Canton JAR, which DPM keeps under `~/.dpm/cache/components/canton-open-source/<sdk-version>/lib/`
- Java 17 or newer
- [`lit`](https://pypi.org/project/lit/)
- [`FileCheck`](https://pypi.org/project/filecheck/)

Then run the suite with `--integration`. It starts a local Canton, runs a `lit` suite against it, and stops it. The suite directory, here `itests`, must exist in the package directory. `--parties Name@N` places each party on participant `N`, so `Alice@1,Bob@2` puts `Alice` on participant 1 and `Bob` on participant 2:
```bash
dpm trace test . --integration itests \
  --canton-jar <path-to-canton.jar> \
  --daml dpm \
  --parties Alice@1,Bob@2
```
Output:
```bash
building DAR ...
booting local Canton (participant1 :56875, participant2 :56878); deploying asset-tests-1.0.0.dar ...
Canton ready: Alice=Alice::1220e1e0...12cbd8, Bob=Bob::1220bdff...c5e509
running integration suite: <package-dir>/itests

-- Testing: 1 tests, 1 workers --
PASS: dpm-trace-integration :: asset-create.test (1 of 1)

Testing Time: 1.96s

Total Discovered Tests: 1
  Passed: 1 (100.00%)
```
The command builds the DAR, starts Canton with `Alice` on participant 1 and `Bob` on participant 2, runs every test in `itests` against it, and stops Canton when the suite ends.
