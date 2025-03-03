import { celebrate, Joi } from 'celebrate';
import { urlRegex } from './custom-url-validator';

export const singupUserValidationSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegex).message('Некорректный формат ссылки'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const singinUserValidationSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const updateUserValidationScheme = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const updateAvatarValidationScheme = celebrate({
  body: Joi.object().keys({ avatar: Joi.string().required().pattern(urlRegex).message('Некорректный формат ссылки') }),
});

export const getUserValidationScheme = celebrate({
  params: Joi.object().keys({ userId: Joi.string().required().hex() }),
});
