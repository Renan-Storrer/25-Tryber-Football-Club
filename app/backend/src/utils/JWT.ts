import { sign, SignOptions } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET as string;

const gnToken = (payload: unknown, expiresIn = '10d') => {
  const jwtConfig: SignOptions = {
    expiresIn,
    algorithm: 'HS256',
  };

  const token = sign({ payload }, secret, jwtConfig);
  return token;
};

export default gnToken;
