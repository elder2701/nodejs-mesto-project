import { Router } from 'express';
import {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;
