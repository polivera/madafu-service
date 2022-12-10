import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASS,
  dbname: process.env.DATABASE_NAME,
  sync: process.env.DATABASE_SYNC,
}));
