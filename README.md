# Walnut documentation contents

This repository contains material used to generate the [Walnut documentation](https://docs.walnut.dev/) website.

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Overview



## Installation

```
pnpm install
```

## Local Development

```
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Deployment

The site is a static [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) deployment of the `build/` directory, configured in `wrangler.jsonc`. It is served at [docs.walnut.dev](https://docs.walnut.dev/) and at `walnut-docs.walnuthq.workers.dev`.

- Pushing to `main` deploys to production (`.github/workflows/deploy-cloudflare.yml`).
- Each pull request is uploaded as a preview version, served at `https://pr-<number>-walnut-docs.walnuthq.workers.dev`, without touching production. The URL is commented on the PR (`.github/workflows/preview-cloudflare.yml`).

Both workflows need the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets.

To serve the production build locally with the Workers runtime, run `pnpm preview`. To deploy by hand, run `pnpm wrangler login` once, then `pnpm run deploy`.


## Updating search index

The search bar utilizes a local search index with [a plugin ](https://github.com/praveenn77/docusaurus-lunr-search).

Whenever needed, the index can be manually updated by: `pnpm build`. To see the changes in local development, use `pnpm serve`.
