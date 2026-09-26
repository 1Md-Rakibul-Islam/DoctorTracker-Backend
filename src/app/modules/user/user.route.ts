import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser
);

router.get('/', UserControllers.getAllUsers);

export const UserRoutes = router;
