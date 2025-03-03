import { Router } from 'express';
import {
  getUsers, getUser, updateUser, updateUserAvatar, getUserInfo,
} from '../controllers/user';
import {
  getUserValidationScheme,
  updateAvatarValidationScheme,
  updateUserValidationScheme,
} from '../utils/validators/user-validator-schemas';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch('/me', updateUserValidationScheme, updateUser);
router.patch('/me/avatar', updateAvatarValidationScheme, updateUserAvatar);
router.get('/:userId', getUserValidationScheme, getUser);

export default router;
