import ResourceRepository from '../../../repositories/resources/resource.repository';

import type { ResourceDetails } from '../../../schemas/resources/aws/resource.schema';

const saveResourceDetails = async (resourceDetails: ResourceDetails) => {
  return ResourceRepository.create(resourceDetails);
};

const ResourceService = {
  saveResourceDetails,
};

export default ResourceService;
