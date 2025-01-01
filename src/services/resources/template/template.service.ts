import { readFileSync } from 'fs';
import { join } from 'path';

import Handlebars from 'handlebars';

const getTerraformTemplateFileDirectory = () => join(__dirname, '../../../../terraform_template');

const compileTemplate = (data: { content: object; filePath: string }) => {
  const fileContent = readFileSync(data.filePath, {
    encoding: 'utf-8',
  });

  const compiledTemplate = Handlebars.compile(fileContent);

  const terraformFileContent = compiledTemplate(data.content);

  return terraformFileContent;
};

const generateTerraformConfigFile = async (data: { content: object; fileWritePath: string }) => {
  const workingDir = getTerraformTemplateFileDirectory();
  const terraformFilePath = join(workingDir, 'terraform.tf');

  const fileData = compileTemplate({
    filePath: terraformFilePath,
    content: data.content,
  });

  return fileData;
};

const generateTerraformEC2File = async (data: { content: object; fileWritePath: string }) => {
  const workingDir = getTerraformTemplateFileDirectory();
  const terraformFilePath = join(workingDir, 'ec2.tf');

  const fileData = compileTemplate({
    filePath: terraformFilePath,
    content: data.content,
  });

  return fileData;
};

const TemplateService = {
  generateTerraformConfigFile,
  generateTerraformEC2File,
};

export default TemplateService;
