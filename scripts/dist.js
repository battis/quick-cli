#!/usr/bin/env node
import { execSync } from 'child_process';
execSync(`npm run build`);
execSync(`npx shx cp package.json dist/`);
//execSync(`npx shx cp package-lock.json dist/`);
execSync(`npx shx cp pnpm-lock.yaml dist/`);
execSync(`npx shx cp LICENSE dist/`);
execSync(`npx shx cp README.md dist/`);
