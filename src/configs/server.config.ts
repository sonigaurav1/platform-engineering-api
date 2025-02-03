export const SERVER_DETAILS = {
  PORT: 4000,
};

export const saltWorkFactor = 10;

export const EMAIL_CONFIG = {
  DEFAULT_SENDER: process.env.DEFAULT_SENDER || '',
};

export const JWT_SECRET_KEY = {
  accessTokenPrivateKey: process.env.JWT_ACCESS_TOKEN || '',
  refreshTokenPrivateKey: process.env.JWT_REFRESH_TOKEN || '',
};

export const AUTH_CONFIG = {
  refreshToken: 'platform-engineering-refresh-token',
  refreshTokenMaxAge: 1000 * 60 * 60 * 24,
  authHeader: 'authorization',
  bearerName: 'Bearer',
};
