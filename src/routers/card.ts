import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/card';
import { actionCardValidationSchema, createCardValidationSchema } from '../utils/validators/card-validator-schemas';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidationSchema, createCard);
router.delete('/:cardId', actionCardValidationSchema, deleteCard);
router.put('/:cardId/likes', actionCardValidationSchema, likeCard);
router.delete('/:cardId/likes', actionCardValidationSchema, dislikeCard);

export default router;
