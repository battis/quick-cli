#!/usr/bin/env node
import { execSync } from 'child_process';
execSync(`npx shx rm -rf dist/lib/*`);
