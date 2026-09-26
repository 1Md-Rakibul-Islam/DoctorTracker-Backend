import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import bcrypt from 'bcrypt';
// Depending on auth flow, we could generate JWT here. The frontend seems to just expect the user object directly.
// Let's generate a basic token if needed, or just return user info.

const loginUser = async (payload: any) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user || !user.password) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found or missing password');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

export const AuthServices = {
  loginUser,
};
