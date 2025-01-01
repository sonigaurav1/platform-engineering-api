import { RESOURCE_STATUS, RESOURCE_TYPE } from '../../../constants/enum';
import { transformResourceTags } from '../../../helpers/payloadTransformer.helper';
import { convertInstanceCountToString, getResourceFileWrittenPath } from '../../../helpers/resource.helper';
import BaseRepository from '../../../repositories/base.repository';
import EC2Repository from '../../../repositories/resources/aws/ec2.repository';
import logger from '../../../utils/logger';
import { generateResourceId } from '../../../utils/uuid';
import ExecutionService from '../execution/execution.service';
import TemplateService from '../template/template.service';

import ResourceService from './resource.service';

import type { DbQueryOptions } from '../../../interfaces/query.interface';
import type { EC2DBDoc, EC2Instance } from '../../../schemas/resources/aws/ec2.schema';
import type { UserDbDoc } from '../../../schemas/user/user.schema';
import type { ClientSession } from 'mongoose';

const saveEC2InstanceDetails = async (ec2Data: Partial<EC2DBDoc>, options: DbQueryOptions) => {
  try {
    await EC2Repository.create(ec2Data, { session: options.session });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const updateEC2InstanceStatus = async (data: { resourceId: string; status: string; options?: DbQueryOptions }) => {
  return EC2Repository.update({ resourceId: data.resourceId }, { status: data.status }, data.options);
};

const createEC2Instance = async (userData: UserDbDoc, ec2Data: EC2Instance) => {
  const session: ClientSession = await BaseRepository.getDbSession();
  session.startTransaction();
  try {
    const terraformWritePath = getResourceFileWrittenPath({
      userData: userData,
      resourceName: 'ec2-instances',
    });

    const terraformConfigFile = `${terraformWritePath}/terraform.tf`;
    const terraformEC2File = `${terraformWritePath}/ec2.tf`;
    const resourceTags = transformResourceTags(ec2Data.tags);

    const terraformFilePromise = TemplateService.generateTerraformConfigFile({
      content: {
        BACKEND_KEY: terraformConfigFile,
      },
      fileWritePath: terraformConfigFile,
    });

    const ec2InstanceFilePromise = TemplateService.generateTerraformEC2File({
      content: {
        PUBLIC_KEY: '',
        EC2_TAG_KEY: resourceTags,
        EC2_INSTANCE_NAME: '',
        EC2_INSTANCE_TYPE: `${ec2Data.instanceType}`,
        EC2_AMI: `${ec2Data.amiId}`,
        EC2_NUMBER_OF_INSTANCE: convertInstanceCountToString(ec2Data.numberOfInstance),
      },
      fileWritePath: terraformEC2File,
    });

    const [terraformConfig, resourceConfig] = await Promise.all([terraformFilePromise, ec2InstanceFilePromise]);

    const resourceId = generateResourceId();

    await saveEC2InstanceDetails(
      {
        ...ec2Data,
        resourceId: resourceId,
        userId: userData.id,
        status: RESOURCE_STATUS.INACTIVE,
      },
      { session: session },
    );

    await ResourceService.saveResourceDetails(
      {
        terraformConfig: terraformConfig,
        resourceConfig: resourceConfig,
        userId: userData.id,
        resourceType: RESOURCE_TYPE.EC2,
        status: RESOURCE_STATUS.INACTIVE,
        terraformStateFileS3Key: terraformConfigFile,
        resourceExecutionPath: terraformWritePath,
        resourceId: resourceId,
      },
      { session: session },
    );

    await ExecutionService.createResourceInCloud({ resourceId: resourceId, callBack: updateEC2InstanceStatus, options: { session: session } });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    logger.error(error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteEC2Instance = async (resourceId: string) => {
  try {
    const callBack = async (data: { resourceId: string; status: string }) => {
      // EC2Repository.softDelete({ resourceId: data.resourceId, userId: userData.id });
      updateEC2InstanceStatus({ resourceId: data.resourceId, status: data.status });
    };

    const response = await ExecutionService.destroyResourceInCloud({ resourceId: resourceId, callBack: callBack });

    return response;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const EC2Service = {
  createEC2Instance,
  updateEC2InstanceStatus,
  deleteEC2Instance,
};

export default EC2Service;
