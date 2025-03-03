import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { celebrate, errors, Joi } from 'celebrate';
import usersRouters from './routers/user';
import cardsRouters from './routers/card';
import errorHandler from './middleware/error-handler';
import NotFoundError from './errors/not-found-error';
import authHandler from './middleware/auth';
import { createUser, login } from './controllers/user';
import { errorLogger, requestLogger } from './middleware/logger';
import { MONGO_URL, PORT } from './utils/constants';

const app = express();

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/users', authHandler, usersRouters);
app.use('/cards', authHandler, cardsRouters);

app.use((_req, _res, next) => {
  next(new NotFoundError('Not Found'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
