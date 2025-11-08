import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types';

export const generateTokens = (payload: JWTPayload) => {
  const accessTokenOptions: SignOptions = {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  };
  
  const refreshTokenOptions: SignOptions = {
    expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
  };

  const accessToken = jwt.sign(payload as any, process.env.JWT_SECRET!, accessTokenOptions);
  const refreshToken = jwt.sign(payload as any, process.env.JWT_REFRESH_SECRET!, refreshTokenOptions);

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JWTPayload;
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as JWTPayload;
};