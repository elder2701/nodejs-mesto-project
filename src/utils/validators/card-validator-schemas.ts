import { celebrate, Joi } from 'celebrate';
import { urlRegex } from './custom-url-validator';

export const createCardValidationSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex).message('Некорректный формат ссылки'),
  }),
});

export const actionCardValidationSchema = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().required().hex() }),
});
