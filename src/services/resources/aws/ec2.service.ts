import { getCurrentDateTime } from '../../../utils/date';
import { getValue } from '../../../utils/object';
import TemplateService from '../template/template.service';

import type { EC2Instance } from '../../../schemas/resources/aws/ec2.schema';

const transformTags = (tags: { [key: string]: string }[]) => {
  const transformedTags: string[] = [];

  tags.forEach((tag) => {
    const key = Object.keys(tag)[0];
    const value = tag[key];
    transformedTags.push(`"${key}" = "${value}"`);
  });

  const resourceTags = transformedTags.join('\n');
  return resourceTags;
};

const createEC2Instance = async (userData: object, ec2Data: EC2Instance) => {
  const userId = getValue(userData, '_id');
  const currentDateTime = getCurrentDateTime();
  const terraformWritePath = `terraform/ec2-instances/${currentDateTime}_${userId}`;

  const terraformConfigFile = `${terraformWritePath}/terraform.tf`;
  const terraformEC2File = `${terraformWritePath}/ec2.tf`;
  const resourceTags = transformTags(ec2Data.tags);

  TemplateService.generateTerraformConfigFile({
    content: {
      BACKEND_KEY: terraformConfigFile,
    },
    fileWritePath: terraformConfigFile,
  });

  TemplateService.generateTerraformEC2File({
    content: {
      TAG_LIST: `{
        ${resourceTags}
      }`,
      INSTANCE_TYPE: `"${ec2Data.instanceType}"`,
      AMI: `"${ec2Data.amiId}"`,
    },
    fileWritePath: terraformEC2File,
  });
};

const EC2Service = {
  createEC2Instance,
};

export default EC2Service;
