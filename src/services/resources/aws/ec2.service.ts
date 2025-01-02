import { RESOURCE_STATUS, RESOURCE_TYPE } from '../../../constants/enum';
import { transformEC2InstanceNumberToTerraformCompatible, transformResourceTags } from '../../../helpers/payloadTransformer.helper';
import { convertInstanceCountToString, getResourceFileWrittenPath } from '../../../helpers/resource.helper';
import BaseRepository from '../../../repositories/base.repository';
import EC2Repository from '../../../repositories/resources/aws/ec2.repository';
import ResourceRepository from '../../../repositories/resources/resource.repository';
import { generateSSHKeyPair } from '../../../utils/crypto';
import logger from '../../../utils/logger';
import { getValue } from '../../../utils/object';
import { generateResourceId } from '../../../utils/uuid';
import ExecutionService from '../execution/execution.service';
import TemplateService from '../template/template.service';

import ResourceService from './resource.service';

import type { DbQueryOptions } from '../../../interfaces/query.interface';
import type { EC2DBDoc, EC2Instance } from '../../../schemas/resources/aws/ec2.schema';
import type { UserDbDoc } from '../../../schemas/user/user.schema';
import type { ClientSession } from 'mongoose';

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
    const sshKey = generateSSHKeyPair();

    const terraformFilePromise = TemplateService.generateTerraformConfigFile({
      content: {
        BACKEND_KEY: terraformConfigFile,
      },
      fileWritePath: terraformConfigFile,
    });

    const resourceId = generateResourceId();

    const { instanceList, resourceList } = transformEC2InstanceNumberToTerraformCompatible({
      instanceData: {
        instance_type: ec2Data.instanceType,
        ami: ec2Data.amiId,
      },
      count: ec2Data.numberOfInstance,
    });

    // return;

    const ec2InstanceFilePromise = TemplateService.generateTerraformEC2File({
      content: {
        PUBLIC_KEY: sshKey.publicKey,
        KEY_PAIR_NAME: `ec2-keypair-${resourceId}`,
        EC2_TAG_KEY: `{
           ${resourceTags}
        }`,
        EC2_INSTANCE_NAME: ec2Data.instanceName,
        EC2_INSTANCE_TYPE: ec2Data.instanceType,
        EC2_AMI: ec2Data.amiId,
        EC2_NUMBER_OF_INSTANCE: convertInstanceCountToString(ec2Data.numberOfInstance),
        EC2_INSTANCE_LIST: instanceList,
      },
      fileWritePath: terraformEC2File,
    });

    const [terraformConfig, resourceConfig] = await Promise.all([terraformFilePromise, ec2InstanceFilePromise]);

    // console.log(resourceConfig);

    // return;

    const ec2DBInsertData = resourceList.map((resource) => {
      const data = {
        ...ec2Data,
        resourceId: resourceId,
        userId: userData.id,
        sshKey: {
          privateKey: sshKey.privateKey,
          publicKey: sshKey.publicKey,
        },
        status: RESOURCE_STATUS.PENDING,
        terraformResourceName: resource.trim(),
      };

      return data as EC2DBDoc;
    });

    await EC2Repository.bulkSave(ec2DBInsertData, { session: session });

    await ResourceService.saveResourceDetails(
      {
        terraformConfig: terraformConfig,
        resourceConfig: resourceConfig,
        userId: userData.id,
        resourceType: RESOURCE_TYPE.EC2,
        status: RESOURCE_STATUS.PENDING,
        terraformStateFileS3Key: terraformConfigFile,
        resourceExecutionPath: terraformWritePath,
        resourceId: resourceId,
      },
      { session: session },
    );

    await session.commitTransaction();
    session.endSession();

    return;
    await ExecutionService.createResourceInCloud({ resourceId: resourceId, callBack: updateEC2InstanceStatus, options: { session: session } });
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

const deleteSpecificEC2Instance = async (resourceId: string) => {
  try {
    // const callBack = async (data: { resourceId: string; status: string }) => {
    //   // EC2Repository.softDelete({ resourceId: data.resourceId, userId: userData.id });
    //   updateEC2InstanceStatus({ resourceId: data.resourceId, status: data.status });
    // };

    const response = await ResourceRepository.findOne({ resourceId: resourceId });
    if (!response) {
      return null;
    }

    const metaData = JSON.parse(response.metaData);
    const ec2Data = getValue(metaData, 'values.root_module.child_modules', []) as unknown as Array<unknown>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ec2InstanceIds = ec2Data.flatMap((item: any) => {
      return item.address;
    });

    return ec2InstanceIds;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const EC2Service = {
  createEC2Instance,
  updateEC2InstanceStatus,
  deleteEC2Instance,
  deleteSpecificEC2Instance,
};

export default EC2Service;
