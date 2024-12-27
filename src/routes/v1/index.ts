import express from 'express';

import resourceRouter from './resources';
import roleRouter from './user/role.routes';
import userRouter from './user/user.routes';

const v1Router = express.Router();

v1Router.use('/role', roleRouter);
v1Router.use('/user', userRouter);
v1Router.use('/resources', resourceRouter);

export default v1Router;
