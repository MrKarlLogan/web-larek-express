import { Joi, Segments, celebrate } from 'celebrate';
import { Types } from 'mongoose';

enum PaymentType {
  Card = 'card',
  Online = 'online',
}

const validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object().keys({
    items: Joi.array().items(
      Joi.string()
        .custom((value, helper) => {
          if (Types.ObjectId.isValid(value)) {
            return value;
          }
          return helper.message({ custom: 'Невалидный id' });
        })
        .messages({
          'array.empty': 'Не указаны товары',
        }),
    ),
    payment: Joi.string()
      .valid(...Object.values(PaymentType))
      .required()
      .messages({
        'string.valid': 'Указано не верный способ оплаты',
        'string.empty': 'Не указан способ оплаты',
      }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Не указан email',
    }),
    phone: Joi.string().required().messages({
      'string.empty': 'Не указан номер телефона',
    }),
    address: Joi.string().required().messages({
      'string.empty': 'Не указан адрес',
    }),
    total: Joi.number().required().messages({
      'string.empty': 'Не указана сумма заказа',
    }),
  }),
});

const validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
      'string.empty': 'Поле "title" должно быть заполнено',
    }),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }),
    category: Joi.string().required().messages({
      'string.empty': 'Поле "category" должно быть заполнено',
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Поле "description" должно быть заполнено',
    }),
    price: Joi.number().allow(null),
  }),
});

const validateObjectId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    productId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (Types.ObjectId.isValid(value)) return value;
        return helpers.message({ any: 'Невалидный id' });
      }),
  }),
});

export { validateCreateOrder, validateCreateProduct, validateObjectId };
