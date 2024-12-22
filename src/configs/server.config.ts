export const SERVER_DETAILS = {
  PORT: 4000,
};

export const saltWorkFactor = 10;

export const EMAIL_CONFIG = {
  DEFAULT_SENDER: 'account@avendi.me',
};

export const JWT_SECRET_KEY = {
  accessTokenPrivateKey:
    '6b43379b6897ece3db01d11bb5072511ee5d931a5996fe4adb1e45b1c4ed5e0a97a140e90cc6ce2c869334a7a7de47ad850e9eb74ef8931610537e48f186d370',
  refreshTokenPrivateKey:
    '9643b19388c828069d51123f147514b0dec675629fe4aff8d306674ee93202b657f8e72f4cdc6151ca9da98abfc9db8472a6ab7c16aa4fabf8178db61619a2a4',
  accessTokenPublicKey: '9643b19388c828069d51123f147514b0d6674ee93202b657f8e72f4cdc6151ca9da98abfc9db8472a6ab7c16aa4fabf8178db61619a2a4',
  refreshTokenPublicKey: '9643b19388c828069d51123f147514b0ff8d306674ee93202b657f8e72f4cdc6151ca9da98abfc9db8472a6ab7c16aa4fabf8178db61619a2a4',
};

export const AUTH_CONFIG = {
  refreshToken: 'glad-pro-refresh-token',
  refreshTokenMaxAge: 1000 * 60 * 60 * 24,
  authHeader: 'authorization',
  bearerName: 'Bearer',
};
