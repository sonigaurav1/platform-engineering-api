import { runCommand } from '../../../helpers/executeCommand.helper';
import logger from '../../../utils/logger';

export const executeTerraformCommand = async (data: { terraformWritePath: string; resourceName: string }) => {
  const { terraformWritePath, resourceName } = data;

  logger.info(`Processing terraform command for ${resourceName}`);

  logger.info(`Initializing terraform in ${terraformWritePath}`);
  await runCommand('terraform init', terraformWritePath);
  logger.info('Terraform initialized successfully!');

  await runCommand('terraform validate', terraformWritePath);
  logger.info('Terraform configuration validated successfully!');

  await runCommand('terraform plan', terraformWritePath);
  logger.info('Terraform plan generated successfully!');

  await runCommand('terraform apply -auto-approve', terraformWritePath);
  logger.info(`Terraform apply for ${resourceName} completed successfully!`);

  logger.info(`${resourceName} created successfully!`);
};
