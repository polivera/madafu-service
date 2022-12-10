import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  key: process.env.TOKEN_KEY,
  accessExpiration: process.env.ACCESS_EXPIRATION || '5m',
  refreshExpiration: process.env.REFRESH_EXPIRATION || '7d',
}));
