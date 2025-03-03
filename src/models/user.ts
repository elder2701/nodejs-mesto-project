import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';
import isUrl from '../utils/custom-url-validator';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String, minlength: 2, maxlength: 30, default: 'Жак-Ив Кусто',
  },
  about: {
    type: String, minlength: 2, maxlength: 200, default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [isUrl, 'Не верный формат url'],
  },
  email: {
    type: String, required: true, unique: true, validate: [isEmail, 'Не верный формат почты'],
  },
  password: { type: String, required: true, select: false },
});

export default model<IUser>('user', userSchema);
