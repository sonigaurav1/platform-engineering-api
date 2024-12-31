import { writeFile, mkdir, rm } from 'fs/promises';
import { dirname } from 'path';

import logger from '../utils/logger';

export const writeFileToDirectory = async (data: { filePath: string; content: string }) => {
  const directory = dirname(data.filePath); // Extract the directory path

  try {
    // Ensure the directory exists (creates it if it doesn't)
    await mkdir(directory, { recursive: true });
    // Write the file
    await writeFile(data.filePath, data.content, 'utf8');
    logger.info(`File written successfully! at directory:  ${directory}`);
  } catch (error) {
    logger.error(`Error writing file: ${error}`);
  }
};

export const cleanUpDisk = async (dirPath: string) => {
  return rm(dirPath, { recursive: true, force: true });
};
