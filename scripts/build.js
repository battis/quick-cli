#!/usr/bin/env node
import { execSync } from 'child_process';
execSync(`npm run clean`);
execSync(`npx tsc`);
