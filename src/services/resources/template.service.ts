import { readFileSync } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';

import Handlebars from 'handlebars';

import logger from '../../utils/logger';

const getTerraformTemplateFileDirectory = () => join(__dirname, '../../../terraform_templates');

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

const generateTerraformConfigFile = (content: object) => {
  const workingDir = getTerraformTemplateFileDirectory();
  const terraformFilePath = join(workingDir, 'terraform.tf');

  const fileData = compileTemplate({
    filePath: terraformFilePath,
    content: content,
  });

  logger.info(fileData);

  writeFileToDirectory({
    filePath: 'terraform/test/terraform.tf',
    content: fileData,
  });
};

const TemplateService = {
  generateTerraformConfigFile,
};

export default TemplateService;
