import { getCurrentDateTime } from '../utils/date';
import { getValue } from '../utils/object';

export const getResourceFileWrittenPath = (data: { userData: object; resourceName: string }) => {
  const { userData, resourceName } = data;
  const userId = getValue(userData, '_id');
  const currentDateTime = getCurrentDateTime();
  const terraformWritePath = `terraform/${resourceName}/${currentDateTime}_${userId}`;

  return terraformWritePath;
};

export const convertInstanceCountToString = (count: number): string => {
  if (count < 1) {
    throw new Error('Count must be greater than or equal to 1');
  }
  const listOfNumber = Array.from({ length: count }, (_, i) => i + 1);

  return listOfNumber.map((num) => `"${num}"`).join(',');
};

export const removeSpecificEC2FromTerraformResourceConfig = (data: { resourceConfig: string; resourceName: string }) => {
  const { resourceConfig, resourceName } = data;

  // Extract the instance key from the resource name
  const match = resourceName.match(/^module\.ec2_instance\["([\w-]+)"\]$/);
  if (!match) {
    throw new Error(`Invalid resource name format: ${resourceName}. Expected format: module.ec2_instance["instance_name"].`);
  }

  const instanceKey = match[1];

  // Regex to find and remove the instance from the variable "instances" block
  const instanceRegex = new RegExp(`"${instanceKey}"\\s*=\\s*\\{[\\s\\S]*?\\}`, 'g');

  // Check if the instance exists in the configuration
  if (!instanceRegex.test(resourceConfig)) {
    throw new Error(`Instance "${instanceKey}" not found in the configuration.`);
  }

  // Replace the instance definition with an empty string to remove it
  const updatedConfig = resourceConfig.replace(instanceRegex, '');

  // Return the updated configuration
  return updatedConfig.trim();
};
