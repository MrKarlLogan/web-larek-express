import { Router } from 'express';
import { createProduct, getProduct } from '../controllers/product';
import { validateCreateProduct } from '../middlewares/validations';

const productRoutes = Router();

productRoutes.get('/', getProduct);
productRoutes.post('/', validateCreateProduct, createProduct);

export default productRoutes;
