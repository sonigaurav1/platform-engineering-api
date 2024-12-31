import { RESOURCE_STATUS } from '../../../constants/enum';
import { transformResourceTags } from '../../../helpers/payloadTransformer.helper';
import { convertInstanceCountToString, getResourceFileWrittenPath } from '../../../helpers/resource.helper';
import BaseRepository from '../../../repositories/base.repository';
import EC2Repository from '../../../repositories/resources/aws/ec2.repository';
import logger from '../../../utils/logger';
import { generateResourceId } from '../../../utils/uuid';
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
        TAG_LIST: resourceTags,
        INSTANCE_TYPE: `"${ec2Data.instanceType}"`,
        AMI: `"${ec2Data.amiId}"`,
        NUMBER_OF_INSTANCE: convertInstanceCountToString(ec2Data.numberOfInstance),
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
        resourceType: 'EC2',
        status: RESOURCE_STATUS.INACTIVE,
        terraformStateFileS3Key: terraformConfigFile,
        resourceExecutionPath: terraformWritePath,
        resourceId: resourceId,
      },
      { session: session },
    );

    // executeTerraformCommand({
    //   resourceName: 'EC2 instance',
    //   terraformWritePath: terraformWritePath,
    // });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    logger.error(error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const EC2Service = {
  createEC2Instance,
};

export default EC2Service;
