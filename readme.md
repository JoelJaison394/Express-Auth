# Express Authentication Template

This is a template project for implementing authentication in a Node.js backend using industry-standard libraries and packages.

## Features

- Implements basic authentication routes (register, login, logout, profile).
- Additional routes for utility purposes (reset password, verify email, etc.).
- Uses Express.js for handling HTTP requests.
- Uses Mongoose for MongoDB ODM.
- Provides token-based authentication using JSON Web Tokens (JWT).
- Implements password hashing using bcrypt.js.
- Utilizes middleware for error handling, logging, and request parsing.
- Includes environment variable configuration using dotenv.

## Dependencies

- **Express.js**: Web framework for Node.js.
- **Mongoose**: MongoDB ODM (Object-Document Mapper) for Node.js.
- **Passport.js**: Authentication middleware for Node.js supporting various strategies like JWT, OAuth, etc.
- **bcrypt.js**: Library for securely hashing passwords.
- **jsonwebtoken**: Library for generating and verifying JSON Web Tokens (JWT).
- **Winston**: Versatile logging library for Node.js.
- **morgan**: HTTP request logger middleware for Express.
- **Zod**: Schema validation library for TypeScript-first development.
- **Mocha**: Feature-rich JavaScript test framework.
- **apidoc**: Inline documentation generator for RESTful APIs.
- **Helmet**: Middleware to secure Express apps by setting various HTTP headers.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **cookie-parser**: Middleware for parsing cookies in Express.
- **body-parser**: Middleware for parsing request bodies in Express.
- **express-rate-limit**: Rate limiting middleware for Express.
- **node-cache**: In-memory caching for Node.js.
- **dotenv**: Loads environment variables from a `.env` file.
