# Walnut documentation contents

This repository contains material used to generate the [Walnut documentation](https://docs.walnut.dev/) website.

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Overview



## Installation

```
npm i
```

## Local Development

```
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Deployment



## Updating search index

The search bar utilizes a local search index with [a plugin ](https://github.com/praveenn77/docusaurus-lunr-search).

Whenever needed, the index can be manually updated by: `npm run build`. To see the changes in local development, use `npm run serve`.
