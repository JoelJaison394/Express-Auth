import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import userLogger from '../winston/userLogger';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { adminSecret }: { adminSecret: string } = req.body;

        if (!id) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        await prisma.$transaction(async (tx) => {
            // Check if admin secret is provided and matches the one stored in env
            if (adminSecret !== process.env.ADMIN_SECRET) {
                res.status(403).json({ error: 'Unauthorized: Missing or invalid admin secret' });
                return;
            }

            // Check if user exists
            const existingUser = await tx.user.findUnique({ where: { id } });
            if (!existingUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Delete the user
            await tx.user.delete({ where: { id } });

            res.status(200).json({ message: 'User deleted successfully' });
        }).catch((error) => {
            userLogger.error({
                message: 'Error in UserController [deleteUserById]',
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
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const banUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { adminSecret, reason }: { adminSecret: string; reason: string } = req.body;

        if (!id) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        await prisma.$transaction(async (tx) => {
            // Check if admin secret is provided and matches the one stored in env
            if (adminSecret !== process.env.ADMIN_SECRET) {
                res.status(403).json({ error: 'Unauthorized: Missing or invalid admin secret' });
                return;
            }

            // Check if user exists
            const existingUser = await tx.user.findUnique({ where: { id } });
            if (!existingUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Ban the user
            await tx.bannedUser.create({
                data: {
                    userId: id,
                    bannedTime: new Date(),
                    reason,
                },
            });

            res.status(200).json({ message: 'User banned successfully' });
        }).catch((error) => {
            userLogger.error({
                message: 'Error in UserController [banUserById]',
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

export const unbanUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { adminSecret }: { adminSecret: string } = req.body;

        if (!id) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        await prisma.$transaction(async (tx) => {
            if (adminSecret !== process.env.ADMIN_SECRET) {
                res.status(403).json({ error: 'Unauthorized: Missing or invalid admin secret' });
                return;
            }

            // Check if user exists
            const existingUser = await tx.user.findUnique({ where: { id } });
            if (!existingUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Unban the user
            await tx.bannedUser.deleteMany({ where: { userId: id } });

            res.status(200).json({ message: 'User unbanned successfully' });
        }).catch((error) => {
            userLogger.error({
                message: 'Error in UserController [unbanUserById]',
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

