import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import auth from '../../middlwares/auth';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser
);

router.get('/', auth('admin'), UserControllers.getAllUsers);

export const UserRoutes = router;
