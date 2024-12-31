import { RESOURCE_STATUS } from '../../../constants/enum';
import { transformResourceTags } from '../../../helpers/payloadTransformer.helper';
import { convertInstanceCountToString, getResourceFileWrittenPath } from '../../../helpers/resource.helper';
import EC2Repository from '../../../repositories/resources/aws/ec2.repository';
import logger from '../../../utils/logger';
// import { executeTerraformCommand } from '../execution/execution.service';
import TemplateService from '../template/template.service';

import type { EC2Instance } from '../../../schemas/resources/aws/ec2.schema';
import type { UserDbDoc } from '../../../schemas/user/user.schema';

const saveEC2InstanceDetails = async (userData: UserDbDoc, ec2Data: EC2Instance) => {
  try {
    const ec2Payload = {
      ...ec2Data,
      userId: userData.id,
      status: RESOURCE_STATUS.ACTIVE,
    };

    await EC2Repository.create(ec2Payload);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const createEC2Instance = async (userData: UserDbDoc, ec2Data: EC2Instance) => {
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

    await Promise.all([terraformFilePromise, ec2InstanceFilePromise]);

    await saveEC2InstanceDetails(userData, ec2Data);

    // executeTerraformCommand({
    //   resourceName: 'EC2 instance',
    //   terraformWritePath: terraformWritePath,
    // });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const EC2Service = {
  createEC2Instance,
};

export default EC2Service;
