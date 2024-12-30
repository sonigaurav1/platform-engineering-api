import { transformResourceTags } from '../../../helpers/payloadTransformer.helper';
import { convertInstanceCountToString, getResourceFileWrittenPath } from '../../../helpers/resource.helper';
import logger from '../../../utils/logger';
import { executeTerraformCommand } from '../execution/execution.service';
import TemplateService from '../template/template.service';

import type { EC2Instance } from '../../../schemas/resources/aws/ec2.schema';

const createEC2Instance = async (userData: object, ec2Data: EC2Instance) => {
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

    executeTerraformCommand({
      resourceName: 'EC2 instance',
      terraformWritePath: terraformWritePath,
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const EC2Service = {
  createEC2Instance,
};

export default EC2Service;
