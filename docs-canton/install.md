---
sidebar_position: 2
title: 'Install'
description: 'Install dpm trace with the install script, a release archive, or as a DPM component'
---

You can install dpm trace in three ways:

* **Install script**: downloads the latest release and registers it with [DPM](https://docs.canton.network/sdks-tools/cli-tools/dpm). Use this for projects that set `sdk-version` in `daml.yaml`.
* **Release archive or source build**: the same binary, installed and registered by hand.
* **DPM component**: for projects that list DPM components instead of setting `sdk-version`.

## Install with the script
On macOS and Linux, run:
```bash
curl -fsSL https://raw.githubusercontent.com/walnuthq/dpm-trace/main/install.sh | sh
```
The script downloads the archive for your platform from the [GitHub releases page](https://github.com/walnuthq/dpm-trace/releases), checks it against `checksums.txt`, and installs `dpm-trace` to `~/.local/bin`. If DPM is installed, it then registers the binary with every Daml SDK in `~/.dpm`, so `dpm trace` works in any project. The output is:
```bash
Downloading dpm-trace_<version>_<os>_<arch>.tar.gz
Installed dpm-trace <version> (<commit>, built <date>) to <home>/.local/bin/dpm-trace
Registered `dpm trace` for SDK <sdk-version>
```
To change the defaults, set these variables before `sh`:

| Variable | Default | Description |
| --- | --- | --- |
| `VERSION` | latest release | Release to install, for example `0.1.4`. |
| `INSTALL_DIR` | `~/.local/bin` | Directory for the binary. |
| `DPM_HOME` | `~/.dpm` | DPM home to register into. |
| `NO_REGISTER` | unset | Set to `1` to skip registration with DPM. |

For example:
```bash
curl -fsSL https://raw.githubusercontent.com/walnuthq/dpm-trace/main/install.sh | VERSION=0.1.4 sh
```
If you install a new SDK later, run `dpm-trace install-plugin --sdk-version <sdk-version>` or run the script again. On Windows, use the release archive.

## Download the binary
The binary has no dependencies, so after you unpack it, you can run `./dpm-trace` right away. Builds exist for Linux, macOS, and Windows, on amd64 and arm64.
```bash
tar xzf dpm-trace_<version>_<os>_<arch>.tar.gz
./dpm-trace --version
```
The output is:
```bash
dpm-trace <version> (<commit>, built <date>)
```
On Windows, unpack the `.zip` and run `dpm-trace.exe`.
## Build from source
If you prefer to build it yourself, you need [Go](https://go.dev/doc/install) 1.25 or newer.
```bash
git clone https://github.com/walnuthq/dpm-trace.git
cd dpm-trace
go build -o dpm-trace ./cmd/trace
./dpm-trace --version
```
```bash
dpm-trace dev (none, built unknown)
```
## Register with DPM
Registering the binary lets you run it as `dpm trace`. This needs [DPM and a Daml SDK installed](https://docs.canton.network/sdks-tools/cli-tools/dpm#installation). All commands in these docs use `dpm trace`, and `dpm-trace <args>` works the same way.

If you do not have DPM, install it with:
```bash
curl https://get.digitalasset.com/install/install.sh | sh
export PATH="$HOME/.dpm/bin:$PATH"
dpm install latest
```
The install script puts `dpm` in `~/.dpm/bin`, which is not on your `PATH` by default. Add the `export` line to your shell profile so new shells find `dpm`.

Then register the binary:
```bash
./dpm-trace install-plugin
```
```bash
Registered dpm-trace <version> as a DPM plugin (SDK <sdk-version>) in <dpm-home>.
Run with:  dpm trace --help
```
### Register for each SDK version
Registration applies to one SDK version: the one active in the current directory, or the highest installed. A project whose `daml.yaml` pins a different `sdk-version` does not see the plugin, and `dpm trace` fails there with `unknown command "trace" for "dpm"`.

To fix it, register again for that version, either from inside the project or by naming the version:
```bash
cd <path-to-daml-project>
<path-to>/dpm-trace install-plugin
# or, from anywhere:
<path-to>/dpm-trace install-plugin --sdk-version <sdk-version>
```
The [install script](#install-with-the-script) registers the binary with every installed SDK, so you do not need this step after using it.

## Add as a DPM component
DPM lets a project list its components in `daml.yaml` instead of setting `sdk-version`. dpm trace is published as a component at `ghcr.io/walnuthq/dpm-trace` for Linux and macOS. In such a project, add it next to the SDK components the project already lists:
```yaml
components:
  - damlc:<sdk-version>
  - daml-script:<sdk-version>
  - oci://ghcr.io/walnuthq/dpm-trace:<version>
```
For a multi-package project, put the `components` list in `multi-package.yaml`, so it applies to every package. Then install the components and check that the command is there:
```bash
dpm install package
dpm trace --version
```
You can also add the line with `dpm add component oci://ghcr.io/walnuthq/dpm-trace:<version>`. It writes to the `daml.yaml` in the current directory.

:::warning
DPM does not allow `sdk-version` and `components` in the same project. If a project has both, every `dpm` command in it fails with:
```bash
project uses both opt-in Components and SDK bundle, but dpm does not allow usage of both simultaneously
```
To use the component, remove `sdk-version` from `daml.yaml` and `multi-package.yaml`, and list the SDK components instead, as shown above. Otherwise, use the [install script](#install-with-the-script). See [Opt-in Components](https://archived.docs.digitalasset.com/build/3.5/dpm/configuration.html) in the DPM documentation.
:::

:::note
`dpm build` and the local Canton also need a Java runtime version 17 or newer.
:::
