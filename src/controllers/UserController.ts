import nodemailer from 'nodemailer';
import {Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authLogger from '../winston/authLogger';

const prisma = new PrismaClient();

const emailUser = process.env.EMAIL_USER || '';
const emailVerificationSecret = process.env.EMAIL_VERIFICATION_SECRET || '';

if (!emailUser || !emailVerificationSecret) {
  throw new Error('EMAIL_USER is not defined');
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailVerificationSecret,
  },
});


interface EmailVerificationRequest {
  email: string;
}


const generateVerificationToken = (email: string): string => {
  const token = jwt.sign({ email }, process.env.EMAIL_VERIFICATION_SECRET as string, { expiresIn: '1d' });
  return token;
};

// Send Verification Email
const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
    try {
        // Construct email message
        const mailOptions = {
            from: emailUser,
            to: email,
            subject: 'Email Verification',
            text: `http://localhost:3000/api/v2/user/verify-token/${token}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email');
    }
};


export const verifyEmail =  async (req: Request, res: Response) => {
    try {
        const { email }: EmailVerificationRequest = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const verificationToken = generateVerificationToken(email);

        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error : any ) {
        authLogger.error({
            message: 'Error in UserController [register]',
            error: error.message,
            timestamp: new Date().toISOString(),
          });         
        console.error('Error in email verification request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export async function verifyToken(req: Request, res: Response) {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET as string) as { email: string; };

        const userEmail = decoded.email;

        await prisma.user.update({
            where: { email: userEmail },
            data: { isVerified: true },
        });

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error: any) {

        authLogger.error({
            message: 'Error in UserController [register]',
            error: error.message,
            timestamp: new Date().toISOString(),
          });
        res.status(400).json({ error: 'Invalid or expired token' });
    }
}

export const getAllUsernames = async (req: Request, res: Response): Promise<void> => {
  try {
      
      const users = await prisma.user.findMany({
          select: {
              id: true,
              username: true,
          },
      });

      res.status(200).json(users);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
      const { id } = req.params;

      if (!id) {
          res.status(400).json({ error: 'Invalid user ID' });
          return;
      }

      const user = await prisma.user.findUnique({
          where: { id },
          select: {
              id: true,
              username: true,
              email: true,
          },
      });

      if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
      }

      res.status(200).json(user);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};



