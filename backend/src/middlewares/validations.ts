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
      originName: Joi.string().required(),
      size: Joi.number().optional(),
      mimetype: Joi.string().optional(),
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

const validateProductUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля name - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originName: Joi.string().required(),
      size: Joi.number().optional(),
      mimetype: Joi.string().optional(),
    }),
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number().allow(null),
  }),
});

const validateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Поле "password" должно быть заполнено',
    }),
    email: Joi.string()
      .required()
      .email()
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({ 'string.empty': 'Поле "email" должно быть заполнено' }),
  }),
});

const validateAuth = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().messages({
      'string.empty': 'Поле "password" должно быть заполнено',
    }),
  }),
});

export {
  validateCreateOrder,
  validateCreateProduct,
  validateObjectId,
  validateProductUpdate,
  validateUser,
  validateAuth,
};
