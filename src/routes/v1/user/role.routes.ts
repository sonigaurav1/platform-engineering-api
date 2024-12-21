import express from 'express';

import RoleController from '../../../controllers/user/role.controller';
import { validateRequestBody } from '../../../middleware/validation.middleware';
import { userRoleCreationSchema } from '../../../schemas/user/user.schema';

const roleRouter = express.Router();

roleRouter.post('/', validateRequestBody(userRoleCreationSchema), RoleController.createNewRole);
roleRouter.put('/:id', validateRequestBody(userRoleCreationSchema), RoleController.updateRole);
roleRouter.delete('/:id', RoleController.deleteRole);
// roleRouter.get('/permission-list', RoleController.getPermissionsList);

roleRouter.get('/:id', RoleController.getRole);

roleRouter.get('/', RoleController.getAllRole);

export default roleRouter;
