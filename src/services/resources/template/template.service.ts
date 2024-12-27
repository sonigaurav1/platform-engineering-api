import { readFileSync } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';

import Handlebars from 'handlebars';

import logger from '../../../utils/logger';

const getTerraformTemplateFileDirectory = () => join(__dirname, '../../../../terraform_template');

async function writeFileToDirectory(data: { filePath: string; content: string }) {
  const directory = dirname(data.filePath); // Extract the directory path

  try {
    // Ensure the directory exists (creates it if it doesn't)
    await mkdir(directory, { recursive: true });

    // Write the file
    await writeFile(data.filePath, data.content, 'utf8');
    logger.info('File written successfully!');
  } catch (error) {
    console.error('Error writing file:', error);
    logger.error(error);
  }
}

const compileTemplate = (data: { content: object; filePath: string }) => {
  const fileContent = readFileSync(data.filePath, {
    encoding: 'utf-8',
  });

  const compiledTemplate = Handlebars.compile(fileContent);

  const terraformFileContent = compiledTemplate(data.content);

  return terraformFileContent;
};

const generateTerraformConfigFile = (data: { content: object; fileWritePath: string }) => {
  const workingDir = getTerraformTemplateFileDirectory();
  const terraformFilePath = join(workingDir, 'terraform.tpl');

  const fileData = compileTemplate({
    filePath: terraformFilePath,
    content: data.content,
  });

  logger.info(fileData);

  writeFileToDirectory({
    filePath: data.fileWritePath,
    content: fileData,
  });
};

const generateTerraformEC2File = (data: { content: object; fileWritePath: string }) => {
  const workingDir = getTerraformTemplateFileDirectory();
  const terraformFilePath = join(workingDir, 'ec2.tpl');

  const fileData = compileTemplate({
    filePath: terraformFilePath,
    content: data.content,
  });

  logger.info(fileData);

  writeFileToDirectory({
    filePath: data.fileWritePath,
    content: fileData,
  });
};

const TemplateService = {
  generateTerraformConfigFile,
  generateTerraformEC2File,
};

export default TemplateService;
