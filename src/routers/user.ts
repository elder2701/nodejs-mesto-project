import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers, getUser, updateUser, updateUserAvatar, getUserInfo,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({ avatar: Joi.string().required() }),
}), updateUserAvatar);
router.get('/:userId', celebrate({
  params: Joi.object().keys({ userId: Joi.string().required().alphanum() }),
}), getUser);

export default router;
