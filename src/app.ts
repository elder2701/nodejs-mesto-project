import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouters from './routers/user';
import cardsRouters from './routers/card';
import { AuthContext } from './types/auth-context';
import errorHandler from './middleware/error-handler';

const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017/mestodb';
const app = express();

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((_req: Request, res: Response<unknown, AuthContext>, next) => {
  res.locals.user = {
    _id: '67b9d7c86eb0a5403c4800f4',
  };
  next();
});

app.use('/users', usersRouters);
app.use('/cards', cardsRouters);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
