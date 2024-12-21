// import { PERMISSIONS_LIST } from '../../config/permissions.config';
import { DynamicMessages } from '../../constants/error';
import RoleService from '../../services/user/role.service';

import type { CustomRequest } from '../../interfaces/auth.interface';
import type { Response, NextFunction } from 'express';

const createNewRole = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = await RoleService.createRole(req.body);
    res.status(201).json({
      message: DynamicMessages.createMessage('Role'),
      success: true,
      role,
    });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await RoleService.updateRole({
      updatedData: req.body,
      id: id,
    });

    res.status(200).json({
      message: DynamicMessages.updateMessage('Role'),
      success: true,
      role,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    await RoleService.deleteRole({
      id: id,
    });

    res.status(200).json({
      message: DynamicMessages.deleteMessage('Role'),
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getRole = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const role = await RoleService.getRole({ id: id });

    res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRole = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page: currentPage, limit: perPage } = req.query;

    let page = 1;
    let limit = 10;
    if (typeof currentPage === 'string' && typeof perPage === 'string') {
      page = parseInt(currentPage, 10);
      limit = parseInt(perPage, 10);
    }

    const roles = await RoleService.getAllRole({ page: page, limit: limit });
    res.status(200).json({ success: true, roles });
  } catch (error) {
    next(error);
  }
};

// const getPermissionsList = async (_req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     res.status(200).json({ success: true, permissions: PERMISSIONS_LIST });
//   } catch (error) {
//     next(error);
//   }
// };

const RoleController = {
  createNewRole,
  updateRole,
  deleteRole,
  getRole,
  getAllRole,
  //   getPermissionsList,
};

export default RoleController;
