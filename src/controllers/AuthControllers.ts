import { Request, Response  } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient, User, UserActionLog , UserSession } from '@prisma/client';
import { ZodError } from 'zod';
import { UserSchema , LoginSchema } from '../zod/userSchema';
import userLogger from '../winston/userLogger';
import  {generateToken}  from '../services/jwt';
import {generateSessionId} from '../services/sessionIDGenerator';

const prisma = new PrismaClient();



export const register = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      UserSchema.parse(req.body);
  
      const {
        name,
        username,
        email,
        password, 
        dob,
        place,
        phoneNumber,
        secondaryEmail
      }: {
        name: string;
        username: string;
        email: string;
        password: string;
        dob: Date;
        place: string;
        phoneNumber: string;
        secondaryEmail: string;
      } = req.body;
  

      const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
      });

      if (existingUser) {
          res.status(400).json({ error: 'Email or username is already in use' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            username,
            email,
            password: hashedPassword, 
            dob: new Date(dob),
            place,
            phoneNumber,
            secondaryEmail
          },
        });
  
        await tx.userActionLog.create({
          data: {
            userId: user.id,
            action: 'REGISTER',
          },
        });
  
        const token = generateToken(user.id);
  
        return { user, token };
      })
        .then((data) => {
          const { user, token } = data;
          res.cookie('token', token, { httpOnly: true });
          res.json(user);
        })
        .catch((error) => {
          userLogger.error({
            message: 'Error in UserController',
            error: error.message,
            timestamp: new Date().toISOString(),
          });
  
          if (error instanceof ZodError) {
            const errorMessages = error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            }));
            res.status(400).json({ errors: errorMessages });
          } else {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  
  export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      LoginSchema.parse(req.body);
      const { emailOrUsername, password }: { emailOrUsername: string; password: string } = req.body;
  
      await prisma.$transaction(async (tx) => {
  
        const user = await tx.user.findFirst({
          where: {
            OR: [
              { email: emailOrUsername },
              { username: emailOrUsername }
            ]
          }
        });
  
        if (!user) {
          res.status(400).json({ error: 'Invalid email/username or password' });
          return;
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
  
          res.status(400).json({ error: 'Invalid email/username or password' });
          return;
        }
        const existingSession = await tx.userSession.findFirst({
          where: {
            userId: user.id,
            logoutTime: null
          }
        });
        if (!existingSession) {
          await tx.userSession.create({
            data: {
              userId: user.id,
              sessionId: generateSessionId()
            }
          });
        }



        const token = generateToken(user.id);
        await tx.userActionLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN'
          }
        });

        await tx.userSession.create({
          data: {
            userId: user.id,
            sessionId: generateSessionId()
          }
        });

        return { user, token } as { user: any; token: string }; 
      }).then((data) => {
        const { user, token } = data as { user: any; token: string };
        res.cookie('token', token, { httpOnly: true });
        res.json(user);
      }
      ).catch((error) => {
        userLogger.error({
          message: 'Error in UserController',
          error: error.message,
          timestamp: new Date().toISOString()
        });
  
        if (error instanceof ZodError) {
          const errorMessages = error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message
          }));
          res.status(400).json({ errors: errorMessages });
        } else {
          console.error('Error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      })
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  