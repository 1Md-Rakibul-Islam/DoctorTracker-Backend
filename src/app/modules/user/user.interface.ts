import { Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'doctor' | 'patient';
}

export type UserModel = Model<IUser>;
