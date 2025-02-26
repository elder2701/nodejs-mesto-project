import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import User from '../models/user';
import { AuthContext } from '../types/auth-context';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User
      .findById(userId)
      .orFail(() => new NotFoundError('Пользователь не найден'));

    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });

    res.status(201).send(user);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Не верные данные для создания пользователя'));
    } else {
      next(error);
    }
  }
};

export const updateUser = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { _id: id } = res.locals.user;
    const user = await User
      .findByIdAndUpdate(id, { ...req.body }, { new: true })
      .orFail(() => new NotFoundError('Пользователь не найден'));

    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;
    const { _id: id } = res.locals.user;
    const user = await User
      .findByIdAndUpdate(id, { avatar }, { new: true })
      .orFail(() => new NotFoundError('Пользователь не найден'));

    res.send(user);
  } catch (error) {
    next(error);
  }
};
