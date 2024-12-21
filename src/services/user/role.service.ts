import { DynamicMessages } from '../../constants/error';
import { RoleModel } from '../../models/user/role.model';
import UserRoleRepository from '../../repositories/user/role.repository';
import createError from '../../utils/http.error';
import { checkIfEmpty } from '../../utils/validation';
import PaginationService from '../pagination/pagination.service';

import type { RoleDbDoc, RoleType } from '../../schemas/user/user.schema';
import type { ObjectId } from 'mongoose';

const createRole = async (payload: RoleType): Promise<RoleDbDoc> => {
  const role = await UserRoleRepository.findOne({ label: payload.label });
  if (!checkIfEmpty(role)) {
    throw createError(409, DynamicMessages.alreadyExistMessage('Role'));
  }

  const roleData = {
    label: payload.label,
    scopes: payload.scopes,
    adminAccess: payload.adminAccess,
  };

  return UserRoleRepository.create(roleData);
};

const updateRole = async (data: { updatedData: RoleType; id: string | ObjectId }): Promise<RoleDbDoc | null> => {
  const { updatedData, id } = data;
  const condition = {
    _id: id,
  };
  return UserRoleRepository.update(condition, updatedData);
};

const deleteRole = async (data: { id: string | ObjectId }): Promise<RoleDbDoc | null> => {
  return UserRoleRepository.softDelete({
    _id: data.id,
  });
};

const getRole = async (data: { id: string | ObjectId }): Promise<RoleDbDoc | null> => {
  const role = await UserRoleRepository.findOne({
    _id: data.id,
  });
  return role;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllRole = async (data: { page: number; limit: number }): Promise<any | null> => {
  const { page, limit } = data;
  const queryOptionData = {
    page: page,
    limit: limit,
    condition: {},
  };
  const roles = await PaginationService.paginate(RoleModel, queryOptionData);
  return roles;
};

const RoleService = {
  createRole,
  updateRole,
  deleteRole,
  getRole,
  getAllRole,
};

export default RoleService;
