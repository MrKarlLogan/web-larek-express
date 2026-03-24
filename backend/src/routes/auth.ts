import { Router } from 'express';
import { login, register, getUser, logout, refreshAccessToken } from '../controllers/auth';
import auth from '../middlewares/auth';
import { validateUser, validateAuth } from '../middlewares/validations';

const authRouter = Router();

authRouter.get('/user', auth, getUser);
authRouter.post('/login', validateAuth, login);
authRouter.post('/register', validateUser, register);
authRouter.get('/token', refreshAccessToken);
authRouter.get('/logout', logout);

export default authRouter;
