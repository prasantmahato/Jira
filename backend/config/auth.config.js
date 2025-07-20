export const authConfig = {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    jwtExpiration: process.env.JWT_EXPIRE_TIME || '15m',
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRE_TIME || '7d',
    bcryptSaltRounds: 12,
    maxLoginAttempts: 500,
    lockoutTime: 15 * 60 * 1000, // 15 minutes
  };