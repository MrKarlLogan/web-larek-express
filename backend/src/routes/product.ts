import express from 'express';
import { createProduct, getProduct } from '../controllers/product';

const productRoutes = express.Router();

productRoutes.get('/', getProduct);
productRoutes.post('/', createProduct);

export default productRoutes;
