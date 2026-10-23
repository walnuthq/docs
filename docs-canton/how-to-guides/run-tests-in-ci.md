---
sidebar_position: 8
title: 'Run tests in CI'
description: 'Run tests in CI'
---

`dpm trace test` runs your Daml Script tests, prints each test's transaction tree, points every failure to the Daml line that caused it, and exits with a non-zero code when a test fails, so the CI job fails too.

It needs Daml Script tests and DPM installed. It does not need the example ledger. The examples below run it on [examples/asset](https://github.com/walnuthq/dpm-trace/tree/main/examples/asset), which keeps its templates in `daml/` and its Script tests in a separate `unittests/` package that depends on the asset DAR.

Build both packages from the package directory:
```bash
dpm build --all
```
This builds the asset DAR before the test package that depends on it.

Then run the tests in `unittests/`:
```bash
dpm trace test unittests --files daml/Test.daml --no-trees
```
`--files daml/Test.daml` runs only the tests in `daml/Test.daml`. The tests run with DPM. The `--no-trees` flag keeps the output to the summary and the failures:
```bash
DPM trace test
  package:  <package-dir>/unittests
  command:  dpm test --files daml/Test.daml
  result:   all 10 passed (10 total)

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
        <package-dir>/daml/Asset.daml:37:20
        basis: damlc inspect: Asset
          35 |       controller owner
          36 |       do
        > 37 |         assertMsg "splitQuantity must be between 1 and quantity - 1"
                                  ^
          38 |           (splitQuantity > 0 && splitQuantity < quantity)
          39 |         kept <- create this with quantity = quantity - splitQuantity
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
    TX 0 1970-01-01T00:00:00Z (Test:50:10)
    #0:0
    │   consumed by: #1:0
    │   referenced by #1:0
    │   disclosed to (since): 'Alice-9b3970be' (0), 'Issuer-d4d95138' (0)
    └─> 'Issuer-d4d95138' creates Asset:Asset@<package-id>
                          with
                            issuer = 'Issuer-d4d95138'; owner = 'Alice-9b3970be'; name = "GOLD"; quantity = 100

    TX 1 1970-01-01T00:00:00Z (Test:52:20)
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

To run it in GitHub Actions, install DPM and the Daml SDK, build both DARs, and call `dpm-trace test` as a step:
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

- `dpm build --all`: builds the package DAR and the `unittests/` package that depends on it.
- `--daml-yaml` and `--dar`: point failures to the assertion in the package under test and check them against its compiled DAR.
- `--junit`: writes JUnit XML for the CI system.
- `LANG` and `LC_ALL`: set to `C.UTF-8`, because `daml test` writes Unicode into its output and aborts under a non-UTF-8 locale.

The `dpm-trace` binary must be on the `PATH` of the job, so add a step that downloads the release binary as described in [Install](../install.md).

To test against a real ledger instead of the in-memory one, you need:

- A Canton JAR, which DPM keeps under `~/.dpm/cache/components/canton-open-source/<sdk-version>/lib/`
- Java 17 or newer
- [`lit`](https://pypi.org/project/lit/)
- [`FileCheck`](https://pypi.org/project/filecheck/)

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
