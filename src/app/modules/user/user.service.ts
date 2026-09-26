import { IUser } from './user.interface';
import User from './user.model';
import config from '../../config';

const createUserIntoDb = async (payload: IUser) => {
  if (!payload.password) {
    payload.password = config.default_password as string || 'default123';
  }
  const result = await User.create(payload);
  const userObj = result.toObject();
  delete userObj.password;
  return userObj;
};

const getAllUsersFromDb = async () => {
  const result = await User.find();
  return result;
};

export const UserServices = {
  createUserIntoDb,
  getAllUsersFromDb,
};
