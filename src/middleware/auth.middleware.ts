import { AUTH_CONFIG, JWT_SECRET_KEY } from '../configs/server.config';
import { PLAIN_RESPONSE_MSG } from '../constants/error';
import createError from '../utils/http.error';
import jwtGenerator from '../utils/jwt.generator';
import { getValue } from '../utils/object';

import type { CustomRequest } from '../interfaces/auth.interface';
import type { NextFunction, Response } from 'express';

export const authenticationMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const jwtRefreshToken = getValue(req.cookies, AUTH_CONFIG.refreshToken);
  const authorizationData = getValue(req.headers, 'authorization');

  if (!authorizationData || !jwtRefreshToken) {
    return next(createError(401, PLAIN_RESPONSE_MSG.unAuthenticated));
  }

  const [bearer, jwtAccessToken] = authorizationData.split(' ');

  if (bearer !== AUTH_CONFIG.bearerName || !jwtAccessToken) {
    return next(createError(401, PLAIN_RESPONSE_MSG.unAuthenticated));
  }

  const { payload } = jwtGenerator.verifyAccessToken(jwtAccessToken, JWT_SECRET_KEY.accessTokenPrivateKey);

  if (payload) {
    req.user = payload.id;
    return next();
  }

  const { refreshPayload } = jwtGenerator.verifyRefreshToken(jwtRefreshToken, JWT_SECRET_KEY.refreshTokenPrivateKey);

  if (!refreshPayload) {
    res.clearCookie(AUTH_CONFIG.refreshToken);
    return next(createError(401, PLAIN_RESPONSE_MSG.unAuthenticated));
  }

  // Generate new tokens
  const newAccessToken = jwtGenerator.generateAccessToken(refreshPayload.id, JWT_SECRET_KEY.accessTokenPrivateKey, '7d');
  const newRefreshToken = jwtGenerator.generateRefreshToken(refreshPayload.id, JWT_SECRET_KEY.refreshTokenPrivateKey);

  req.user = refreshPayload.id;

  res.cookie(AUTH_CONFIG.refreshToken, newRefreshToken, {
    httpOnly: req.secure,
    secure: req.secure,
    sameSite: 'lax',
    maxAge: AUTH_CONFIG.refreshTokenMaxAge,
  });

  res.setHeader(AUTH_CONFIG.authHeader, `${AUTH_CONFIG.bearerName} ${newAccessToken}`);

  next();
};
