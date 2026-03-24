import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { Error as MongooseError } from 'mongoose';
import Product from '../model/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import movingFile from '../utils/movingFile';
import { UPLOAD_PATH, UPLOAD_PATH_TEMP } from '../config';

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

    if (image) {
      movingFile(
        image.fileName,
        join(__dirname, '..', 'public', UPLOAD_PATH_TEMP),
        join(__dirname, '..', 'public', UPLOAD_PATH),
      );
    }

    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    return res.status(201).send(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    return next(error);
  }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { image } = req.body;

    if (image) {
      movingFile(
        image.fileName,
        join(__dirname, '..', 'public', UPLOAD_PATH_TEMP),
        join(__dirname, '..', 'public', UPLOAD_PATH),
      );
    }

    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    }).orFail(() => new NotFoundError('Нет товара по заданному id'));
    return res.send(product);
  } catch (e) {
    if (e instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(e.message));
    }
    if (e instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан не валидный ID товара'));
    }
    if (e instanceof Error && e.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    return next(e);
  }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId).orFail(
      () => new NotFoundError('Нет товара по заданному id'),
    );
    return res.send(product);
  } catch (e) {
    if (e instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан не валидный ID товара'));
    }
    return next(e);
  }
};

export { getProduct, createProduct, updateProduct, deleteProduct };
