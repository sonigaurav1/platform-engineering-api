import { RESOURCE_STATUS, RESOURCE_TYPE } from '../../../constants/enum';
import { runCommand } from '../../../helpers/executeCommand.helper';
import { cleanUpDisk, writeFileToDirectory } from '../../../helpers/file.helper';
import ResourceRepository from '../../../repositories/resources/resource.repository';
import logger from '../../../utils/logger';

import type { DbQueryOptions, DbTransactionOptions } from '../../../interfaces/query.interface';

type CallBackType = (arg: { resourceId: string; resourceData: object }) => void;

const executeResourceCreationTerraformCommand = async (data: {
  terraformWritePath: string;
  resourceName: string;
  resourceId: string;
  callBack: CallBackType;
}) => {
  const { terraformWritePath, resourceName, resourceId } = data;
  try {
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

    const { stdoutData } = await runCommand('terraform show -json | jq', terraformWritePath);
    logger.info('Resource details displayed successfully!');

    // call the callback function to update the resource status
    data.callBack({ resourceId: resourceId, resourceData: { status: RESOURCE_STATUS.RUNNING, metaData: stdoutData } });
  } catch (error) {
    // Update the status of the resource to FAILED
    data.callBack({ resourceId: resourceId, resourceData: { status: RESOURCE_STATUS.FAILED } });
    logger.error(`Error while executing terraform command: ${error}`);
  } finally {
    await cleanUpDisk(terraformWritePath);
    logger.info(`Resource created file cleaned up successfully! at path:  ${terraformWritePath}`);
  }
};

const executeResourceDeletionTerraformCommand = async (data: {
  terraformWritePath: string;
  resourceName: string;
  resourceId: string;
  callBack: CallBackType;
}) => {
  const { terraformWritePath, resourceName, resourceId } = data;
  try {
    logger.info(`Processing terraform command for ${resourceName} with resourceId: ${resourceId}`);

    logger.info(`Initializing terraform in ${terraformWritePath}`);

    await runCommand('terraform init', terraformWritePath);
    logger.info('Terraform initialized successfully!');

    await runCommand('terraform destroy -auto-approve', terraformWritePath);
    logger.info(`Terraform destroy for ${resourceName} completed successfully!`);

    logger.info(`${resourceName} with resourceId:${resourceId} deleted successfully!`);

    data.callBack({ resourceId: resourceId, resourceData: { status: RESOURCE_STATUS.DELETED, isDeleted: true } });
  } catch (error) {
    logger.error(`Error while executing terraform command: ${error}`);
  } finally {
    await cleanUpDisk(data.terraformWritePath);
    logger.info(`Resource deletion file cleaned up successfully! at path: ${terraformWritePath}`);
  }
};

const executeSpecificResourceDeletionTerraformCommand = async (data: {
  terraformResourceId: string;
  terraformWritePath: string;
  resourceName: string;
  resourceId: string;
  callBack: CallBackType;
}) => {
  const { terraformWritePath, resourceName, resourceId, terraformResourceId } = data;
  try {
    logger.info(`Processing terraform command for ${terraformResourceId} with resourceId: ${resourceId} ${resourceName}`);

    logger.info(`Initializing terraform in ${terraformWritePath}`);

    await runCommand('terraform init', terraformWritePath);
    logger.info('Terraform initialized successfully!');

    await runCommand(`terraform destroy -target='${terraformResourceId}' -auto-approve`, terraformWritePath);
    logger.info(`Terraform destroy for resourceId: ${terraformResourceId} completed successfully!`);

    // Update the status of the resource to DELETED
    data.callBack({ resourceId: terraformResourceId, resourceData: { status: RESOURCE_STATUS.DELETED } });
  } catch (error) {
    logger.error(`Error while executing terraform command: ${error}`);
  } finally {
    // await cleanUpDisk(data.terraformWritePath);
    logger.info(`Resource deletion file cleaned up successfully! at path: ${terraformWritePath}`);
  }
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
  callBack: CallBackType;
}) => {
  try {
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
  } catch (error) {
    logger.error(`Error while executing terraform apply command: ${error}`);
  }
};

const writeTerraformResourceDestroyConfigFileToDiskAndExecute = async (data: {
  terraformWritePath: string;
  terraformConfig: string;
  resourceConfig: string;
  resourceType: string;
  resourceId: string;
  callBack: CallBackType;
}) => {
  try {
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
  } catch (error) {
    logger.error(`Error while executing terraform destroy command: ${error}`);
  }
};

const writeTerraformSpecificResourceDestroyConfigFileToDiskAndExecute = async (data: {
  terraformWritePath: string;
  terraformConfig: string;
  resourceConfig: string;
  resourceType: string;
  resourceId: string;
  terraformResourceId: string;
  callBack: CallBackType;
}) => {
  try {
    await writeTerraformConfigFileToDisk({
      terraformWritePath: data.terraformWritePath,
      terraformConfig: data.terraformConfig,
      resourceConfig: data.resourceConfig,
      resourceType: data.resourceType,
    });

    executeSpecificResourceDeletionTerraformCommand({
      terraformResourceId: data.terraformResourceId,
      terraformWritePath: data.terraformWritePath,
      resourceName: data.resourceType,
      resourceId: data.resourceId,
      callBack: data.callBack,
    });
  } catch (error) {
    logger.error(`Error while executing terraform destroy command: ${error}`);
  }
};

const createResourceInCloud = async (data: {
  resourceId: string;
  callBack: (arg: { resourceId: string; resourceData: object }) => void;
  options?: DbQueryOptions;
}) => {
  try {
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
  } catch (error) {
    logger.error(`Error while creating resource in cloud: ${error}`);
  }
};

const destroyResourceInCloud = async (data: { resourceId: string; callBack: CallBackType; options?: DbTransactionOptions }) => {
  try {
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
  } catch (error) {
    logger.error(`Error while destroying resource in cloud: ${error}`);
  }
};

const destroySpecificResourceInCloud = async (data: {
  newResourceConfig: string;
  resourceId: string;
  callBack: CallBackType;
  options?: DbTransactionOptions;
}) => {
  try {
    const { callBack, resourceId, newResourceConfig } = data;

    const resourceDetails = await ResourceRepository.findOne({ resourceId: resourceId });
    if (!resourceDetails) {
      logger.info(`Resource with resourceId: ${resourceId} not found in database.`);
      return;
    }

    writeTerraformResourceCreateConfigFileToDiskAndExecute({
      terraformWritePath: resourceDetails.resourceExecutionPath,
      terraformConfig: resourceDetails.terraformConfig,
      resourceConfig: newResourceConfig,
      resourceType: resourceDetails.resourceType,
      resourceId: resourceDetails.resourceId,
      callBack: callBack,
    });
  } catch (error) {
    logger.error(`Error at destroySpecificResourceInCloud(): ${error}`);
  }
};

const destroySpecificResourceInCloudWithoutUpdatingTerraformFile = async (data: {
  terraformResourceId: string;
  newResourceConfig: string;
  resourceId: string;
  callBack: CallBackType;
  options?: DbTransactionOptions;
}) => {
  try {
    const { callBack, terraformResourceId, resourceId, newResourceConfig } = data;

    const resourceDetails = await ResourceRepository.findOne({ resourceId: resourceId });
    if (!resourceDetails) {
      logger.info(`Resource with resourceId: ${resourceId} not found in database.`);
      return;
    }

    await writeTerraformSpecificResourceDestroyConfigFileToDiskAndExecute({
      terraformResourceId: terraformResourceId,
      resourceType: RESOURCE_TYPE.EC2,
      terraformConfig: resourceDetails.terraformConfig,
      resourceConfig: newResourceConfig,
      terraformWritePath: resourceDetails.resourceExecutionPath,
      resourceId: resourceDetails.resourceId,
      callBack: callBack,
    });
  } catch (error) {
    logger.error(`Error at destroySpecificResourceInCloud(): ${error}`);
  }
};

const ExecutionService = {
  createResourceInCloud,
  destroyResourceInCloud,
  destroySpecificResourceInCloud,
  destroySpecificResourceInCloudWithoutUpdatingTerraformFile,
};

export default ExecutionService;
