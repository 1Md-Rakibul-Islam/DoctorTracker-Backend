import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'admin' },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user.isModified('password') && user.password) {
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds) || 12);
  }
  next();
});

const User = model<IUser, UserModel>('User', userSchema);

export default User;
