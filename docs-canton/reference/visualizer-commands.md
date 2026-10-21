---
sidebar_position: 3
title: 'Visualizer commands'
description: 'Commands available after --visualize'
---

Commands available after `--visualize`. Type `help` in the session for the full form.

| Command | What it does |
| --- | --- |
| `n`, `p` | Go to the next or previous event. |
| `j <n>` | Jump to step `n`. |
| `tree [depth]` | Show the whole transaction. `=>` marks the current event. |
| `collapse [id\|all]`, `expand [id\|all]` | Fold and unfold a subtree of the tree. |
| `filter <value>` | Narrow the steps to the events that match. |
| `matches`, `find <value>` | List the matches, or jump to the next match. |
| `payload`, `payload <text>` | Show the whole value when it is truncated, or only the lines that contain the text. |
| `vars`, `json` | Print every field of the current event, or the event as JSON. |
| `b <spec>`, `c` | Set a breakpoint on a step number (`b 3`) or a template or choice name (`b Split`), and run to the next breakpoint. |
| `diff` | Show the contracts this transaction created and archived. |
| `s` | Show the source of the current event. |
| `context` | Say what the trace does and does not contain. |
| `help`, `q` | List all commands, or leave the session. |
