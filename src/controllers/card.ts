import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Card, { ICard } from '../models/card';
import { AuthContext } from '../types/auth-context';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenRequestError from '../errors/forbidden-request-error';

export const getCards = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});

    res.send(cards);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: Request<unknown, unknown, Pick<ICard, 'name' | 'link'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const { _id: owner } = res.locals.user;
    const card = await Card.create({ name, link, owner });

    res.status(201).send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Не верные данные для создания карточки'));
    } else {
      next(error);
    }
  }
};

export const deleteCard = async (
  req: Request<{cardId: string}>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const { _id: owner } = res.locals.user;
    const card = await Card
      .findOneAndDelete({ _id: cardId })
      .orFail(() => new NotFoundError('Карточка не найдена'));

    if (card.owner.toString() !== owner) {
      throw new ForbiddenRequestError('Невозможно удалить чужую карточку');
    }

    res.send(card);
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (
  req: Request<{cardId: string}>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const { _id: likes } = res.locals.user;
    const card = await Card
      .findByIdAndUpdate(cardId, { $addToSet: { likes } }, { new: true })
      .orFail(() => new NotFoundError('Карточка не найдена'));

    res.send(card);
  } catch (error) {
    next(error);
  }
};

export const dislikeCard = async (
  req: Request<{cardId: string}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const { _id: likes } = res.locals.user;
    const card = await Card
      .findByIdAndUpdate(cardId, { $pull: { likes } }, { new: true })
      .orFail(() => new NotFoundError('Карточка не найдена'));

    res.send(card);
  } catch (error) {
    next(error);
  }
};
