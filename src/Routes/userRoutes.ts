import express from 'express';
const router = express.Router();
import { register , login , logout } from '../controllers/AuthControllers';
import rateLimit from 'express-rate-limit';
import {jwtAuth} from '../middlewares/jwtAuth'
import {sessionMiddleware} from '../middlewares/authenticateSession'
import {verifyEmail , verifyToken , getAllUsernames , getUserById} from '../controllers/UserController'
import { deleteUserById , banUserById , unbanUserById } from '../controllers/AdminController'


const Registerlimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100, 
    message: 'Too many requests from this IP, please try again later'
});

router.post('/register',Registerlimiter,register);
router.post('/login',Registerlimiter,login);
router.post('/logout',jwtAuth,sessionMiddleware,logout);
router.post('/verify-email',Registerlimiter,verifyEmail);
router.get('/verify-token/:token',verifyToken);
router.delete('/delete-user/:id',Registerlimiter,jwtAuth,sessionMiddleware,deleteUserById);
router.get('/get-all-usernames',Registerlimiter,getAllUsernames);
router.get('/get-user/:id',Registerlimiter,getUserById);
router.post('/ban-user/:id',jwtAuth,Registerlimiter,sessionMiddleware,banUserById);
router.post('/unban-user/:id',Registerlimiter,jwtAuth,sessionMiddleware,unbanUserById);

export default router;