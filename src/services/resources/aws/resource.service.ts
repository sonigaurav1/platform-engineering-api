import ResourceRepository from '../../../repositories/resources/resource.repository';

import type { DbTransactionOptions } from '../../../interfaces/query.interface';
import type { ResourceDBDoc } from '../../../schemas/resources/aws/resource.schema';

const saveResourceDetails = async (resourceDetails: Partial<ResourceDBDoc>, options?: DbTransactionOptions) => {
  return ResourceRepository.create(resourceDetails, options);
};

const ResourceService = {
  saveResourceDetails,
};

export default ResourceService;
