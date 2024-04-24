import jwt, { Secret } from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
    const JWT_SECRET: Secret = process.env.JWT_SECRET || '';

    if (!JWT_SECRET || JWT_SECRET === '') {
        throw new Error('JWT_SECRET is not defined');
    }

    const JWT_TOKEN = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
    return JWT_TOKEN;
};