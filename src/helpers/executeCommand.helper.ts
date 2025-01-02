import { spawn } from 'child_process';

import logger from '../utils/logger';

export const runCommand = (command: string, workingDir: string): Promise<{ stdoutData: string }> => {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const process = spawn(cmd, args, { cwd: workingDir, shell: true });

    let stdoutData = '';

    // Log stdout data
    process.stdout.on('data', (data) => {
      stdoutData += data.toString();
      logger.info(`Output: ${data.toString()}`);
    });

    // Log stderr data
    process.stderr.on('data', (data) => {
      logger.error(`Error: ${data.toString()}`);
    });

    // Handle process completion
    process.on('close', (code) => {
      if (code === 0) {
        resolve({ stdoutData: stdoutData });
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

export const runCommandWithJq = (command: string, workingDir: string): Promise<{ stdoutData: string }> => {
  return new Promise((resolve, reject) => {
    const process = spawn('bash', ['-c', `${command} | jq`], { cwd: workingDir, shell: true });

    let stdoutData = '';
    let stderrData = '';

    // Collect stdout data
    process.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    // Collect stderr data
    process.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    // Handle process completion
    process.on('close', (code) => {
      if (code === 0) {
        // Parse stdout as JSON
        resolve({ stdoutData: stdoutData });
      } else {
        reject(new Error(`Command "${command}" failed with exit code ${code}. Stderr: ${stderrData}`));
      }
    });

    // Handle process errors
    process.on('error', (error) => {
      reject(new Error(`Command "${command}" execution error: ${error.message}`));
    });
  });
};
