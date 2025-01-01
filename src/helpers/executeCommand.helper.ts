import { spawn } from 'child_process';

import logger from '../utils/logger';

export const runCommand = (command: string, workingDir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const process = spawn(cmd, args, { cwd: workingDir, shell: true });

    // Log stdout data
    process.stdout.on('data', (data) => {
      logger.info(`Output: ${data.toString()}`);
    });

    // Log stderr data
    process.stderr.on('data', (data) => {
      logger.error(`Error: ${data.toString()}`);
    });

    // Handle process completion
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command}" failed with exit code ${code}`));
      }
    });

    // Handle process errors
    process.on('error', (error) => {
      reject(new Error(`Command "${command}" execution error: ${error.message}`));
    });
  });
};
