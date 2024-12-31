import { RESOURCE_STATUS } from '../../../constants/enum';
import { runCommand } from '../../../helpers/executeCommand.helper';
import { cleanUpDisk, writeFileToDirectory } from '../../../helpers/file.helper';
import ResourceRepository from '../../../repositories/resources/resource.repository';
import logger from '../../../utils/logger';
import ResourceService from '../aws/resource.service';

import type { DbQueryOptions } from '../../../interfaces/query.interface';

const executeTerraformCommand = async (data: {
  terraformWritePath: string;
  resourceName: string;
  resourceId: string;
  callBack: (arg: { resourceId: string; status: string }) => void;
}) => {
  const { terraformWritePath, resourceName, resourceId } = data;

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

  await runCommand('terraform show', terraformWritePath);
  logger.info('Resource details displayed successfully!');

  await cleanUpDisk(terraformWritePath);
  logger.info('Resource created file cleaned up successfully!');

  // Update the status of the resource to ACTIVE
  ResourceService.updateResourceStatus({ resourceId: resourceId, status: RESOURCE_STATUS.ACTIVE });
  data.callBack({ resourceId: resourceId, status: RESOURCE_STATUS.ACTIVE });
};

const writeTerraformConfigFileToDiskAndExecute = async (data: {
  terraformWritePath: string;
  terraformConfig: string;
  resourceConfig: string;
  resourceType: string;
  resourceId: string;
  callBack: (arg: { resourceId: string; status: string }) => void;
}) => {
  const terraformConfigPromise = writeFileToDirectory({
    filePath: `${data.terraformWritePath}/terraform.tf`,
    content: data.terraformConfig,
  });

  const resourceConfigPromise = writeFileToDirectory({
    filePath: `${data.terraformWritePath}/${data.resourceType}.tf`,
    content: data.resourceConfig,
  });

  await Promise.all([terraformConfigPromise, resourceConfigPromise]);

  executeTerraformCommand({
    terraformWritePath: data.terraformWritePath,
    resourceName: data.resourceType,
    resourceId: data.resourceId,
    callBack: data.callBack,
  });
};

const createResourceInCloud = async (data: {
  resourceId: string;
  callBack: (arg: { resourceId: string; status: string }) => void;
  options?: DbQueryOptions;
}) => {
  const resourceDetails = await ResourceRepository.findOne({ resourceId: data.resourceId }, { session: data.options?.session });

  if (!resourceDetails) {
    logger.info(`Resource with resourceId: ${data.resourceId} not found in database.`);
    return;
  }

  writeTerraformConfigFileToDiskAndExecute({
    terraformWritePath: resourceDetails.resourceExecutionPath,
    terraformConfig: resourceDetails.terraformConfig,
    resourceConfig: resourceDetails.resourceConfig,
    resourceType: resourceDetails.resourceType,
    resourceId: resourceDetails.resourceId,
    callBack: data.callBack,
  });
};

const ExecutionService = {
  executeTerraformCommand,
  createResourceInCloud,
};

export default ExecutionService;
