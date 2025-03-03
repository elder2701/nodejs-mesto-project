import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { AuthContext } from '../types/auth-context';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import UnauthorizedError from '../errors/unauthorized-error';
import ConflictRequestError from '../errors/coflict-request-error';
import { ACCESS_SECRET_KEY, SALT } from '../utils/constants';

export const login = async (
  req: Request<unknown, unknown, Pick<IUser, 'email' | 'password'>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password').orFail(() => new UnauthorizedError());

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedError();
    }

    const token = jwt.sign({ _id: user._id }, ACCESS_SECRET_KEY, { expiresIn: '7d' });

    res
      .cookie('token', token, { httpOnly: true, maxAge: 604800000 })
      .send({ message: 'Вход в систему произошел успешно' });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request<{userId: string}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await User
      .findById(userId)
      .orFail(() => new NotFoundError('Пользователь не найден'));

    res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      next(new BadRequestError('Не верный id карточки'));
    } else {
      next(error);
    }
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      password,
    } = req.body;
    const hash = await bcrypt.hash(password, SALT);
    await User.create({
      ...req.body, password: hash,
    });

    res.status(201).send({ message: 'Пользователь успешно создан' });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Не верные данные для создания пользователя'));
    } else if ((error as {code: number}).code === 1100) {
      next(new ConflictRequestError('Такой пользователь уже существует'));
    } else {
      next(error);
    }
  }
};

export const updateUser = async (
  req: Request<unknown, unknown, Pick<IUser, 'name' | 'about'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { _id: id } = res.locals.user;

    const user = await User
      .findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Не верные данные для обновление данных пользователя'));
    } else {
      next(error);
    }
  }
};

export const updateUserAvatar = async (
  req: Request<unknown, unknown, Pick<IUser, 'avatar'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;
    const { _id: id } = res.locals.user;
    const user = await User
      .findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true });

    res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Не верные данные для обновление данных пользователя'));
    } else {
      next(error);
    }
  }
};

export const getUserInfo = async (
  _req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { _id: id } = res.locals.user;
    const user = await User.findById(id);

    res.send(user);
  } catch (error) {
    next(error);
  }
};
