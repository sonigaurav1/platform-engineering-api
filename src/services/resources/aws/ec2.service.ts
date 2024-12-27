import { getCurrentDateTime } from '../../../utils/date';
import { getValue } from '../../../utils/object';
import TemplateService from '../template/template.service';

const createEC2Instance = async (userData: object) => {
  const userId = getValue(userData, '_id');
  const currentDateTime = getCurrentDateTime();
  const terraformWritePath = `terraform/ec2-instances/${currentDateTime}_${userId}`;

  const terraformConfigFileKey = `${terraformWritePath}/terraform.tf`;
  const terraformEC2FileKey = `${terraformWritePath}/ec2.tf`;

  TemplateService.generateTerraformConfigFile({
    content: {
      BACKEND_KEY: terraformConfigFileKey,
    },
    fileWritePath: terraformConfigFileKey,
  });

  TemplateService.generateTerraformEC2File({
    content: {
      TAG_LIST: `{
        Name = "${userId}-ec2-${currentDateTime}"
        ENV = "staging"
      }`,
    },
    fileWritePath: terraformEC2FileKey,
  });
};

const EC2Service = {
  createEC2Instance,
};

export default EC2Service;
