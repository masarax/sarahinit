#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { installGlobalSkill } from './skill-installer.js';

const { values } = parseArgs({
  options: {
    update: { type: 'boolean', short: 'u' },
    verbose: { type: 'boolean', short: 'v' }
  }
});

installGlobalSkill({
  force: Boolean(values.update),
  silent: !values.verbose
}).catch((error) => {
  if (values.verbose) {
    console.error('sarahinit failed:', error.message);
  }
  process.exit(1);
});
