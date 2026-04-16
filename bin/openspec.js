#!/usr/bin/env node

const { main } = require("../dist/src/cli.js");

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
