#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { main } from '../src/index.js';

const { values } = parseArgs({
  options: {
    update: { type: 'boolean', short: 'u' }
  }
});

main({ updateMode: values.update }).catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
