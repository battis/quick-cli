#!/usr/bin/env node
import dotenv from 'dotenv';
import shelljs from 'shelljs';

dotenv.config();

if (
  shelljs.which('expect').stdout.trim().length &&
  !/\d+\.\d/.test(shelljs.exec('op --version').stdout) &&
  process.env.OP_SERVICE_ACCOUNT_TOKEN &&
  process.env.OP_VAULT
) {
  shelljs.exec(
    `spawn npx np ${process.argv
      .splice(2)
      .join(
        ' '
      )}; expect "OTP'; send $(op item get npm--otp--vault = '$OP_VAULT')`
  );
} else {
  shelljs.exec(`npx np ${process.argv.splice(2).join(' ')}`);
}
