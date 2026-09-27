import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import User from '../modules/user/user.model';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token.replace('Bearer ', ''),
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }

    const { role, email } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    (req as Request & { user: JwtPayload }).user = decoded as JwtPayload;
    next();
  });
};

export default auth;
