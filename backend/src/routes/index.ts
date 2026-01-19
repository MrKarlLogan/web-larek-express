import { Router, Request, Response, NextFunction } from 'express';
import productRoutes from './product';
import orderRoutes from './order';
import authRouter from './auth';
import auth from '../middlewares/auth';
import uploadRouter from './upload';
import NotFoundError from '../errors/not-found-error';

const router = Router();

router.use('/auth', authRouter);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/upload', auth, uploadRouter);

router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
