import { Router } from 'express';
import { createProduct, getProduct, updateProduct, deleteProduct } from '../controllers/product';
import {
  validateCreateProduct,
  validateObjectId,
  validateProductUpdate,
} from '../middlewares/validations';
import auth from '../middlewares/auth';

const productRoutes = Router();

productRoutes.get('/', getProduct);
productRoutes.post('/', validateCreateProduct, createProduct);
productRoutes.patch('/:productId', auth, validateObjectId, validateProductUpdate, updateProduct);
productRoutes.delete('/:productId', auth, validateObjectId, deleteProduct);

export default productRoutes;
