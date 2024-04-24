import winston , {format} from 'winston';

const userLogger = winston.createLogger({
    transports: [
        // new winston.transports.Console(),
        new winston.transports.File({ filename: 'user.log' })
    ],
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss' 
        }),
        format.errors({ stack: true }),
        format.json()
    )
});

export default userLogger;
