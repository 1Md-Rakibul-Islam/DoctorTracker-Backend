import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidations } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidations.registerValidationSchema),
  AuthControllers.registerUser
);

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  '/refresh-token',
  AuthControllers.refreshToken
);

export const AuthRoutes = router;
