import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
 

interface DecodedToken {
  userId: string;
}

interface RequestWithUserId extends Request {
  userId?: string;
}

export const jwtAuth = (req: RequestWithUserId, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  console.log('Token:', token);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token format' });
    } else {
      console.error('Unexpected error during JWT verification:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
