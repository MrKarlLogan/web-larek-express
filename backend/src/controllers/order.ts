import { Request, Response } from 'express';
import Product, { IProduct } from '../model/product';

const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, total } = req.body;

    const products = await Product.find({
      _id: { $in: items },
    }).catch(() => []);

    const basket: IProduct[] = [];

    items.forEach((id: string) => {
      const product = products.find(p => p._id.toString() === id);

      if (!product) throw new Error(`Товар с ${id} не найден`);

      if (product?.price === null) throw new Error(`Товар с ${id} не продаётся`);

      return basket.push(product);
    });

    const totalBasket = basket.reduce((acc, item) => acc + item.price!, 0);
    if (totalBasket !== total) throw new Error('Неверная сумма заказа');

    return res.status(200).send({
      id: crypto.randomUUID(),
      total,
    });
  } catch (error) {
    let statusCode = 400;
    const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';

    if (errorMessage.includes('не найден')) statusCode = 404;

    if (errorMessage.includes('не продаётся') || errorMessage.includes('Неверная сумма заказа'))
      statusCode = 400;

    return res.status(statusCode).send({
      message: errorMessage,
    });
  }
};

export default createOrder;
