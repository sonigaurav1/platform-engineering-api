import ResourceRepository from '../../../repositories/resources/resource.repository';

import type { DbTransactionOptions } from '../../../interfaces/query.interface';
import type { ResourceDBDoc } from '../../../schemas/resources/aws/resource.schema';

const saveResourceDetails = async (resourceDetails: Partial<ResourceDBDoc>, options?: DbTransactionOptions) => {
  return ResourceRepository.create(resourceDetails, options);
};

const updateResourceStatus = async (data: { resourceId: string; updatedData: object; options?: DbTransactionOptions }) => {
  return ResourceRepository.update({ resourceId: data.resourceId }, data.updatedData, data.options);
};

const updateResourceMetaData = async (data: { resourceId: string; metaData: string; options?: DbTransactionOptions }) => {
  return ResourceRepository.update({ resourceId: data.resourceId }, { metaData: data.metaData }, data.options);
};

const ResourceService = {
  saveResourceDetails,
  updateResourceStatus,
  updateResourceMetaData,
};

export default ResourceService;
