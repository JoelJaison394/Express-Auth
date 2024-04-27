import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Session {
  sessionId: string;
}

interface RequestWithUserId extends Request {
    userId?: string;
    sessionId?: string;
  }

export const sessionMiddleware = async (req: RequestWithUserId, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      next();
      return;
    }

    const session = await prisma.userSession.findFirst({
      where: {
        userId,
      },
    });

    if (session) {
      req.sessionId = session.sessionId;
    }
    await prisma.$disconnect();
    next();
  } catch (error) {
    console.error('Error in session middleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
