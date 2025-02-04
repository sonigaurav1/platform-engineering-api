import { EC2Client, DescribeImagesCommand, DescribeInstanceTypesCommand } from '@aws-sdk/client-ec2';

import type { AmiInfo } from '../schemas/resources/aws/ami.schema';
import type { InstanceTypeCustomInfo } from '../schemas/resources/aws/instanceType.schema';
import type { InstanceTypeInfo } from '@aws-sdk/client-ec2';

const client = new EC2Client({ region: 'us-east-1' }); // Adjust region if needed

const amiFilterOS = ['amzn2-ami-hvm-*', 'amzn-ami-hvm-*', 'amazon-linux-2023-*', 'ubuntu/images/hvm-ssd/*', '*rhel*', '*debian*'];

export const getFilteredAMIs = async (): Promise<AmiInfo[]> => {
  try {
    const command = new DescribeImagesCommand({
      Owners: ['amazon'], // Only official AWS AMIs
      Filters: [
        { Name: 'name', Values: amiFilterOS },
        { Name: 'state', Values: ['available'] },
        { Name: 'is-public', Values: ['true'] }, // Free tier AMIs are public
        { Name: 'root-device-type', Values: ['ebs'] }, // Most Free Tier AMIs use EBS
      ],
    });

    const response = await client.send(command);
    if (!response.Images) return [];

    // Sort AMIs by creation date (latest first)
    const sortedAMIs = response.Images.sort((a, b) => new Date(b.CreationDate!).getTime() - new Date(a.CreationDate!).getTime());

    const osMap: Record<string, string> = {
      'amzn2-ami-hvm': 'Amazon Linux',
      'amzn-ami-hvm': 'Amazon Linux',
      'amazon-linux-2023': 'Amazon Linux',
      ubuntu: 'Ubuntu',
      rhel: 'Red Hat',
      debian: 'Debian',
    };

    const selectedAMIs: AmiInfo[] = [];
    const osArchTracker: Record<string, { x86_64?: AmiInfo; arm64?: AmiInfo }> = {};

    for (const image of sortedAMIs) {
      if (!image.Name || !image.ImageId || !image.Architecture) continue;

      // Identify OS type
      const osType = Object.entries(osMap).find(([key]) => image.Name?.includes(key))?.[1];
      if (!osType) continue;

      // Extract version from AMI name
      const versionMatch = image.Name.match(/(\d+\.\d+)/) || image.Name.match(/(\d+)/);
      const version = versionMatch ? versionMatch[0] : 'Unknown';

      // Determine architecture
      const arch = image.Architecture === 'arm64' ? 'arm64' : 'x86_64';

      // Skip if we already have an AMI for this OS & architecture
      if (osArchTracker[osType]?.[arch]) continue;

      const amiInfo: AmiInfo = {
        name: `${osType} ${version} (${arch})`,
        description: image.Description || '',
        ami: image.ImageId,
        architecture: arch,
        os: osType,
      };

      if (!osArchTracker[osType]) osArchTracker[osType] = {};
      osArchTracker[osType][arch] = amiInfo;

      selectedAMIs.push(amiInfo);

      // Stop once we have both `x86_64` and `arm64` for this OS
      if (osArchTracker[osType].x86_64 && osArchTracker[osType].arm64) continue;
    }

    return selectedAMIs.sort((a, b) => a.os.localeCompare(b.os));
  } catch (error) {
    console.error('Error fetching AMIs:', error);
    throw error;
  }
};

export const getAvailableInstanceTypes = async (): Promise<InstanceTypeCustomInfo[]> => {
  try {
    let instanceTypes: InstanceTypeInfo[] = [];
    let nextToken: string | undefined = undefined;

    do {
      const command: DescribeInstanceTypesCommand = new DescribeInstanceTypesCommand({
        NextToken: nextToken, // Handle pagination
        Filters: [{ Name: 'instance-type', Values: ['t2.*'] }],
      });

      const response = await client.send(command);
      if (response.InstanceTypes) {
        instanceTypes = [...instanceTypes, ...response.InstanceTypes];
      }
      nextToken = response.NextToken; // Check for more pages
    } while (nextToken);

    return instanceTypes
      .map((instance) => ({
        instanceType: instance.InstanceType || '',
        freeTierEligible: instance.FreeTierEligible || false,
        cpuInfo: instance.VCpuInfo,
        memoryInfo: instance.MemoryInfo,
      }))
      .sort((a, b) => (a.memoryInfo?.SizeInMiB ?? 0) - (b.memoryInfo?.SizeInMiB ?? 0));
  } catch (error) {
    console.error('Error fetching instance types:', error);
    throw error;
  }
};
