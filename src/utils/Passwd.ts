import { hash, verify } from 'argon2';

export const hashPassword = (passwd: string): Promise<string> => {
  return hash(passwd);
};

export const checkPassword = (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return verify(hashedPassword, password);
};
