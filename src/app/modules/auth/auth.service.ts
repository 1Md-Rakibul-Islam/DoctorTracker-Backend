import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import config from '../../config';

import { IUser } from '../user/user.interface';
import { TLoginUser } from './auth.interface';

const registerUser = async (payload: IUser) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User with this email already exists');
  }

  // Create new user
  const newUser = await User.create(payload);
  const userObj = newUser.toObject();
  delete userObj.password;

  return userObj;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user || !user.password) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found or missing password');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password as string);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in as SignOptions['expiresIn'] }
  );

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expires_in as SignOptions['expiresIn'] }
  );

  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt_refresh_secret as string) as jwt.JwtPayload;
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token!');
  }

  const { email } = decoded;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in as SignOptions['expiresIn'] }
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
  refreshToken,
};
