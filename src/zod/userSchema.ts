import { z } from 'zod';


export const createUserSchema = z.object({
    name: z.string().min(3),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    dob: z.string(), // Adjust type based on actual input format (e.g., date string)
    place: z.string(),
    phoneNumber: z.string().min(10).max(15),
    secondaryEmail: z.string().email()
});