import express from 'express';
const router = express.Router();
import { register , login , logout } from '../controllers/AuthControllers';
import rateLimit from 'express-rate-limit';
import {jwtAuth} from '../middlewares/jwtAuth'
import {sessionMiddleware} from '../middlewares/authenticateSession'


const Registerlimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100, 
    message: 'Too many requests from this IP, please try again later'
});

router.post('/register',Registerlimiter,register);
router.post('/login',Registerlimiter,login);
router.post('/logout',jwtAuth,sessionMiddleware,logout);

export default router;