import { RESOURCE_STATUS } from '../../../constants/enum';
import { runCommand } from '../../../helpers/executeCommand.helper';
import { cleanUpDisk, writeFileToDirectory } from '../../../helpers/file.helper';
import ResourceRepository from '../../../repositories/resources/resource.repository';
import logger from '../../../utils/logger';
import ResourceService from '../aws/resource.service';

import type { DbQueryOptions, DbTransactionOptions } from '../../../interfaces/query.interface';

const executeResourceCreationTerraformCommand = async (data: {
  terraformWritePath: string;
  resourceName: string;
  resourceId: string;
  callBack: (arg: { resourceId: string; status: string }) => void;
}) => {
  const { terraformWritePath, resourceName, resourceId } = data;

  logger.info(`Processing terraform command for ${resourceName} with resourceId: ${resourceId}`);

  logger.info(`Initializing terraform in ${terraformWritePath}`);
  await runCommand('terraform init', terraformWritePath);
  logger.info('Terraform initialized successfully!');

  await runCommand('terraform validate', terraformWritePath);
  logger.info('Terraform configuration validated successfully!');

  await runCommand('terraform plan', terraformWritePath);
  logger.info('Terraform plan generated successfully!');

  await runCommand('terraform apply -auto-approve', terraformWritePath);
  logger.info(`Terraform apply for ${resourceName} completed successfully!`);

  logger.info(`${resourceName} with resourcedId:${resourceId} created successfully!`);

  await runCommand('terraform show', terraformWritePath);
  logger.info('Resource details displayed successfully!');

  await cleanUpDisk(terraformWritePath);
  logger.info('Resource created file cleaned up successfully!');

  // Update the status of the resource to ACTIVE
  ResourceService.updateResourceStatus({ resourceId: resourceId, status: RESOURCE_STATUS.ACTIVE });
  data.callBack({ resourceId: resourceId, status: RESOURCE_STATUS.ACTIVE });
};

const executeResourceDeletionTerraformCommand = async (data: {
  terraformWritePath: string;
  resourceName: string;
  resourceId: string;
  callBack: (arg: { resourceId: string; status: string }) => void;
}) => {
  const { terraformWritePath, resourceName, resourceId } = data;

  logger.info(`Processing terraform command for ${resourceName} with resourceId: ${resourceId}`);

  logger.info(`Initializing terraform in ${terraformWritePath}`);

  await runCommand('terraform init', terraformWritePath);
  logger.info('Terraform initialized successfully!');

  await runCommand('terraform destroy -auto-approve', terraformWritePath);
  logger.info(`Terraform destroy for ${resourceName} completed successfully!`);

  logger.info(`${resourceName} with resourceId:${resourceId} deleted successfully!`);

  await cleanUpDisk(terraformWritePath);
  logger.info('Resource deletion file cleaned up successfully!');

  // Update the status of the resource to DELETED
  ResourceService.updateResourceStatus({ resourceId: resourceId, status: RESOURCE_STATUS.DELETED });
  data.callBack({ resourceId: resourceId, status: RESOURCE_STATUS.DELETED });
};

const writeTerraformConfigFileToDisk = async (data: {
  terraformWritePath: string;
  terraformConfig: string;
  resourceConfig: string;
  resourceType: string;
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
};

const writeTerraformResourceCreateConfigFileToDiskAndExecute = async (data: {
  terraformWritePath: string;
  terraformConfig: string;
  resourceConfig: string;
  resourceType: string;
  resourceId: string;
  callBack: (arg: { resourceId: string; status: string }) => void;
}) => {
  await writeTerraformConfigFileToDisk({
    terraformWritePath: data.terraformWritePath,
    terraformConfig: data.terraformConfig,
    resourceConfig: data.resourceConfig,
    resourceType: data.resourceType,
  });

  executeResourceCreationTerraformCommand({
    terraformWritePath: data.terraformWritePath,
    resourceName: data.resourceType,
    resourceId: data.resourceId,
    callBack: data.callBack,
  });
};

const writeTerraformResourceDestroyConfigFileToDiskAndExecute = async (data: {
  terraformWritePath: string;
  terraformConfig: string;
  resourceConfig: string;
  resourceType: string;
  resourceId: string;
  callBack: (arg: { resourceId: string; status: string }) => void;
}) => {
  await writeTerraformConfigFileToDisk({
    terraformWritePath: data.terraformWritePath,
    terraformConfig: data.terraformConfig,
    resourceConfig: data.resourceConfig,
    resourceType: data.resourceType,
  });

  executeResourceDeletionTerraformCommand({
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

  writeTerraformResourceCreateConfigFileToDiskAndExecute({
    terraformWritePath: resourceDetails.resourceExecutionPath,
    terraformConfig: resourceDetails.terraformConfig,
    resourceConfig: resourceDetails.resourceConfig,
    resourceType: resourceDetails.resourceType,
    resourceId: resourceDetails.resourceId,
    callBack: data.callBack,
  });
};

const destroyResourceInCloud = async (data: {
  resourceId: string;
  callBack: (arg: { resourceId: string; status: string }) => void;
  options?: DbTransactionOptions;
}) => {
  const { resourceId, callBack } = data;
  const resourceDetails = await ResourceRepository.findOne({ resourceId: resourceId });
  if (!resourceDetails) {
    logger.info(`Resource with resourceId: ${resourceId} not found in database.`);
    return;
  }

  writeTerraformResourceDestroyConfigFileToDiskAndExecute({
    terraformWritePath: resourceDetails.resourceExecutionPath,
    terraformConfig: resourceDetails.terraformConfig,
    resourceConfig: resourceDetails.resourceConfig,
    resourceType: resourceDetails.resourceType,
    resourceId: resourceDetails.resourceId,
    callBack: callBack,
  });
};

const ExecutionService = {
  createResourceInCloud,
  destroyResourceInCloud,
};

export default ExecutionService;
