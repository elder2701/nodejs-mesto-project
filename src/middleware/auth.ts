import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { ACCESS_SECRET_KEY } from '../utils/constants';

const authHandler = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, ACCESS_SECRET_KEY);
  } catch (error) {
    next(error);
    return;
  }

  res.locals.user = payload;

  next();
};

export default authHandler;
