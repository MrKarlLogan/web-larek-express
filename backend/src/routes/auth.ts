import { Router } from 'express';
import { login, register, getUser, logout, refreshAccessToken } from '../controllers/auth';
import auth from '../middlewares/auth';

const authRouter = Router();

authRouter.get('/user', auth, getUser);
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/token', refreshAccessToken);
authRouter.get('/logout', logout);

export default authRouter;
