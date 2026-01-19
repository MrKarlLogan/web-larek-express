import express from 'express';
import createOrder from '../controllers/order';

const orderRoutes = express.Router();

orderRoutes.post('/', createOrder);

export default orderRoutes;
