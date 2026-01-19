import { NextFunction, Request, Response, Router } from 'express';
import NotFoundError from '../errors/not-found-error';
import productRoutes from './product';
import orderRoutes from './order';

const routes = Router();

routes.use('/product', productRoutes);
routes.use('/order', orderRoutes);

routes.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default routes;
