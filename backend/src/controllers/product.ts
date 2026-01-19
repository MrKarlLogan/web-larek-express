import { NextFunction, Request, Response } from 'express';
import Product from '../model/product';

const getProduct = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    return res.send({ items: products, total: products.length });
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, image, category, description, price } = req.body;

    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    return res.status(201).send(product);
  } catch (error) {
    return next(error);
  }
};

export { getProduct, createProduct };
