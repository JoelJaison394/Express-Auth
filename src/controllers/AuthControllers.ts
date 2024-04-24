import { Request, Response  } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { ZodError } from 'zod';
import { createUserSchema } from '../zod/userSchema';
import userLogger from '../winston/userLogger';
import  {generateToken}  from '../services/jwt'

const prisma = new PrismaClient();



export const register = async (req: Request, res: Response ): Promise<void> => {
    try {
        // Validate the request body
        createUserSchema.parse(req.body);

        // Destructure the request body
        const { name, username, email, password, dob, place, phoneNumber, secondaryEmail }: 
        { name: string; username: string; email: string; password: string; dob: Date; place: string; phoneNumber: string; secondaryEmail: string } = req.body;

        const user: User = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password,
                dob: new Date(dob), 
                place,
                phoneNumber,
                secondaryEmail
            }
        });

        // Generate JWT token
        const token = generateToken(user.id);
        
        console.log(token);

        res.json(user);
    } catch (error: any) {
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
            // Handle other errors
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};