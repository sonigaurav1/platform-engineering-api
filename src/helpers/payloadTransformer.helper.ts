type InstanceConfig = {
  ami: string;
  instance_type: string;
};

const INSTANCE_COUNT_TO_STRING = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
};

export const transformResourceTags = (tags: { [key: string]: string }[]) => {
  const transformedTags: string[] = [];

  tags.forEach((tag) => {
    const key = Object.keys(tag)[0];
    const value = tag[key];
    transformedTags.push(`${key} = "${value}"`);
  });

  const resourceTags = transformedTags.join('\n');
  return resourceTags;
};

export const transformEC2InstanceNumberToTerraformCompatible = (data: {
  instanceData: InstanceConfig;
  count: number;
}): { instanceList: string; resourceList: string[] } => {
  const { instanceData, count } = data;

  const instanceList = [];
  const resourceList = [];

  for (let i = 1; i <= count; i++) {
    const resourceName = `instance_${INSTANCE_COUNT_TO_STRING[i as keyof typeof INSTANCE_COUNT_TO_STRING]}`.trim();
    const data = `
      ${resourceName} = {
        ami = "${instanceData.ami}"
        instance_type = "${instanceData.instance_type}"
      }
    `;

    instanceList.push(data);
    resourceList.push(`module.ec2_instance["${resourceName}"]`);
  }

  return {
    instanceList: instanceList.join('\n'),
    resourceList: resourceList,
  };
};
