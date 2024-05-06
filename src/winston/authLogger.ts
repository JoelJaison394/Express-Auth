import winston , {format} from 'winston';

const authLogger = winston.createLogger({
    transports: [
        // new winston.transports.Console(),
        new winston.transports.File({ filename: 'auth.log' })
    ],
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss' 
        }),
        format.errors({ stack: true }),
        format.json()
    )
});

export default authLogger;
