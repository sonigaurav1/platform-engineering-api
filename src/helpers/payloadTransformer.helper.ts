export const transformResourceTags = (tags: { [key: string]: string }[]) => {
  const transformedTags: string[] = [];

  tags.forEach((tag) => {
    const key = Object.keys(tag)[0];
    const value = tag[key];
    transformedTags.push(`"${key}" = "${value}"`);
  });

  const resourceTags = transformedTags.join('\n');
  return resourceTags;
};
