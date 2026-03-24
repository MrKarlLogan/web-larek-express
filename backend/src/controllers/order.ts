import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product, { IProduct } from '../model/product';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total } = req.body;

    const products = await Product.find({
      _id: { $in: items },
    }).catch(() => []);

    const basket: IProduct[] = [];

    items.forEach((id: string) => {
      const product = products.find(p => p._id.toString() === id);

      if (!product) throw new NotFoundError(`Товар с ${id} не найден`);

      if (product?.price === null) throw new BadRequestError(`Товар с ${id} не продаётся`);

      return basket.push(product);
    });

    const totalBasket = basket.reduce((acc, item) => acc + item.price!, 0);
    if (totalBasket !== total) throw new BadRequestError('Неверная сумма заказа');

    return res.status(200).send({
      id: crypto.randomUUID(),
      total,
    });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    return next(error);
  }
};

export default createOrder;
