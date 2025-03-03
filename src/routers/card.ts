import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/card';

const router = Router();

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().required().alphanum() }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().required().alphanum() }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().required().alphanum() }),
}), dislikeCard);

export default router;
