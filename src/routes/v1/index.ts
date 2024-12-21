import express from 'express';

import roleRouter from './user/role.routes';
import userRouter from './user/user.routes';

const v1Router = express.Router();

v1Router.use('/role', roleRouter);
v1Router.use('/user', userRouter);

export default v1Router;
