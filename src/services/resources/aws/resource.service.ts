import ResourceRepository from '../../../repositories/resources/resource.repository';

import type { DbTransactionOptions } from '../../../interfaces/query.interface';
import type { ResourceDBDoc } from '../../../schemas/resources/aws/resource.schema';

const saveResourceDetails = async (resourceDetails: Partial<ResourceDBDoc>, options?: DbTransactionOptions) => {
  return ResourceRepository.create(resourceDetails, options);
};

const updateResourceStatus = async (data: { resourceId: string; status: string; options?: DbTransactionOptions }) => {
  return ResourceRepository.update({ resourceId: data.resourceId }, { status: data.status }, data.options);
};

const ResourceService = {
  saveResourceDetails,
  updateResourceStatus,
};

export default ResourceService;
