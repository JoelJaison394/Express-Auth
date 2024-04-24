import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes  from './Routes/userRoutes';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middlewares

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/test', (req: Request, res: Response) => {
  res.send('Server is up and running!');
});


app.use('/api/v2/user', userRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Graceful shutdown
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Server has been gracefully shut down');
    process.exit(0);
  });
});
