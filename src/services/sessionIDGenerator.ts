import { v4 as uuidv4 } from 'uuid';

export const generateSessionId = (): string => {
    return uuidv4();
};