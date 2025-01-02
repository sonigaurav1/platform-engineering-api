type InstanceConfig = {
  ami: string;
  instance_type: string;
};

type Instances = {
  [key: string]: InstanceConfig;
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

export const transformEC2InstanceNumberToList = (data: { instanceData: InstanceConfig; count: number }): Instances => {
  const instances: Instances = {};
  const { instanceData, count } = data;

  for (let i = 1; i <= count; i++) {
    instances[`instance${i}`] = {
      ami: instanceData.ami,
      instance_type: instanceData.instance_type,
    };
  }

  return instances;
};

export const transformEC2InstanceListToTerraformCompatible = (instances: unknown) => {
  const jsonString = JSON.stringify(instances, null, 2);
  const replacedColons = jsonString.replace(/:/g, '='); // Replace all colons with equals signs
  const replacedCommas = replacedColons.replace(/,/g, '\n'); // Replace all commas with new lines
  return replacedCommas;
};
