---
sidebar_position: 2
title: 'Install'
description: 'Get the dpm trace binary and register it with DPM'
---

Download the binary for your platform from the [GitHub releases page](https://github.com/walnuthq/dpm-trace/releases). To run it as `dpm trace`, register it with [DPM](https://docs.canton.network/sdks-tools/cli-tools/dpm).
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
dpm install latest
```
Then register the binary:
```bash
./dpm-trace install-plugin
```
```bash
Registered dpm-trace <version> as a DPM plugin (SDK <sdk-version>) in <dpm-home>.
Run with:  dpm trace --help
```

:::note
`dpm build` and the local Canton also need a Java runtime version 17 or newer.
:::
