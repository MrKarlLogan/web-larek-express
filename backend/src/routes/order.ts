import { Router } from 'express';
import createOrder from '../controllers/order';
import { validateCreateOrder } from '../middlewares/validations';

const orderRoutes = Router();

orderRoutes.post('/', validateCreateOrder, createOrder);

export default orderRoutes;
