import logger from '../../../utils/logger';
import { openAiClient } from '../../../utils/openai';

import type { EC2Instance } from '../../../schemas/resources/aws/ec2.schema';

interface EC2OpenAiPayload extends EC2Instance {
  region: string;
}

const generateEc2InstanceTerraformConfigFile = async (payload: EC2OpenAiPayload) => {
  const { numberOfInstance, instanceType, amiId, region, tags } = payload;
  try {
    // Generate a structured prompt
    const prompt = `Generate a valid Terraform configuration file to create ${numberOfInstance} EC2 instance(s) using the instance type '${instanceType}' and the AMI '${amiId}' and the tags '${tags}' in the AWS region '${region}'.`;

    const response = await openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert in Terraform. Your task is to generate only valid, executable Terraform configuration files without any explanation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    const terraformConfig = response.choices[0]?.message?.content?.trim();

    if (!terraformConfig) {
      throw new Error('No Terraform configuration was generated.');
    }

    // console.log('Generated Terraform Configuration:', terraformConfig);

    // You can return or store the terraformConfig as needed
    return terraformConfig;
  } catch (error) {
    logger.error(`Error at generateEc2InstanceTerraformConfigFile(): ${error}`);
    throw error;
  }
};

const AwsOpenAiService = {
  generateEc2InstanceTerraformConfigFile,
};

export default AwsOpenAiService;
