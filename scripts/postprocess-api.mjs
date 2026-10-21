import {
  readFileSync,
  writeFileSync,
  renameSync,
  rmSync,
  copyFileSync,
  existsSync,
} from 'node:fs';

const ref = 'api-docs/reference';

// EVM has a single endpoint: flatten its folder into one page titled "EVM Simulation API".
// Only runs when evmApi is enabled in docs.features.json.
if (existsSync(`${ref}/evm-simulation`)) {
  const evm = readFileSync(`${ref}/evm-simulation/simulate.api.mdx`, 'utf8')
    .replace(/"Simulate"/g, '"EVM Simulation API"')
    .replace(/^sidebar_label:.*$/m, (m) => `${m}\nsidebar_position: 1`)
    .replace(/^info_path:.*\n/m, '');
  writeFileSync(`${ref}/simulate.api.mdx`, evm);
  renameSync(
    `${ref}/evm-simulation/simulate.RequestSchema.json`,
    `${ref}/simulate.RequestSchema.json`
  );
  renameSync(
    `${ref}/evm-simulation/simulate.StatusCodes.json`,
    `${ref}/simulate.StatusCodes.json`
  );
  rmSync(`${ref}/evm-simulation`, { recursive: true, force: true });
}

// "API Reference" landing + Starknet category config; drop redundant per-API "Introduction".
if (existsSync(ref))
  copyFileSync('openapi/reference-category.json', `${ref}/_category_.json`);
if (existsSync(`${ref}/starknet-simulation`)) {
  copyFileSync(
    'openapi/starknet-simulation-category.json',
    `${ref}/starknet-simulation/_category_.json`
  );
  rmSync(`${ref}/starknet-simulation/walnut-starknet-simulation-api.info.mdx`, {
    force: true,
  });
}
