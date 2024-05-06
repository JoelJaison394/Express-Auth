# Express Authentication Template
This template provides a solid foundation for building authentication features into your Node.js web applications using the Express framework. With secure authentication routes and robust dependency management, you can focus on developing your application's unique features while ensuring user data remains protected.



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
- **@prisma/client**: Prisma Client is used for interacting with the database and managing data models.
- **bcryptjs**: These libraries are used for hashing passwords securely, ensuring user password protection.
- **jsonwebtoken**: JSON Web Tokens (JWT) are utilized for user authentication and authorization, providing a secure and stateless mechanism for managing user sessions.
- **nodemailer**: Nodemailer is employed for sending verification emails during the user registration process, enhancing account security.
- **express**: Express.js is a minimal and flexible Node.js web application framework used for creating robust APIs and web applications.
- **express-rate-limit**: This middleware provides rate limiting functionality to prevent abuse of authentication routes and enhance security.
- **helmet**: Helmet helps secure Express applications by setting various HTTP headers to mitigate common security vulnerabilities.
- **cors**: CORS (Cross-Origin Resource Sharing) middleware is utilized to enable cross-origin requests and enhance application security.
- **zod**: Zod is a TypeScript-first schema declaration and validation library used for validating request payloads and ensuring data integrity.
- **winston**: Winston is a versatile logging library that allows for easy logging configuration and management, improving debugging and error tracking capabilities.
- **dotenv**: Dotenv loads environment variables from a .env file into process.env, simplifying configuration management across different environments.cache**: 
- 
# Environment Variables Documentation

#### DATABASE_URL

Defines the connection URL for the MongoDB database.

- Example: `DATABASE_URL="mongodb+srv://username:password@cluster0.ohokkyf.mongodb.net/Main?retryWrites=true&w=majority&appName=Cluster0"`

#### JWT_SECRET

Defines the secret key used for JSON Web Token (JWT) generation.

- Example: `JWT_SECRET="S4FGTjIO"`

#### EMAIL_VERIFICATION_SECRET

Defines the secret key used for email verification token generation.

- Example: `EMAIL_VERIFICATION_SECRET="iuh kjbh Dgca"`

#### EMAIL_USER

Defines the email address used for sending verification emails.

- Example: `EMAIL_USER="someone3@gmail.com"`

#### ADMIN_SECRET

Defines the secret key for admin authentication.

- Example: `ADMIN_SECRET="@14Tr.,87HJ"`

# Schema Documentation
## User

Represents a user in the system.

- `id` (String, required): Unique identifier for the user.
- `name` (String, required): User's name.
- `username` (String, required, unique): User's unique username.
- `email` (String, required, unique): User's unique email address.
- `password` (String, required): User's password.
- `dob` (DateTime, required): User's date of birth.
- `place` (String, required): User's place of residence.
- `phoneNumber` (String, required): User's phone number.
- `secondaryEmail` (String, required): User's secondary email address.
- `isVerified` (Boolean, default: false): Indicates if the user's email is verified.
- `createdAt` (DateTime, default: now()): Timestamp of user creation.
- `updatedAt` (DateTime, default: now()): Timestamp of last update.

## UserSession

Represents a session for a user's login.

- `id` (String, required): Unique identifier for the session.
- `userId` (String, required): ID of the user associated with the session.
- `sessionId` (String, required, unique): Unique session identifier.
- `loginTime` (DateTime, default: now()): Timestamp of session login.
- `logoutTime` (DateTime): Timestamp of session logout (nullable).

## UserActionLog

Logs user actions in the system.

- `id` (String, required): Unique identifier for the log entry.
- `userId` (String, required): ID of the user performing the action.
- `action` (String, required): Description of the action performed.
- `timestamp` (DateTime, default: now()): Timestamp of action.

## RouteStatistics

Stores statistics for API routes.

- `id` (String, required): Unique identifier for the route statistics.
- `routePath` (String, required, unique): Path of the API route.
- `requestCount` (Int, default: 0): Number of requests made to the route.
- `averageLatency` (Float): Average latency of requests to the route.

## RouteAlert

Stores alerts for API routes.

- `id` (String, required): Unique identifier for the route alert.
- `routePath` (String, required): Path of the API route.
- `requestCount` (Int): Number of requests made to the route.
- `timestamp` (DateTime, default: now()): Timestamp of the alert.

## Admin

Represents an admin user in the system.

- `id` (String, required): Unique identifier for the admin user.
- `username` (String, required, unique): Admin's unique username.
- `email` (String, required, unique): Admin's unique email address.
- `password` (String, required): Admin's password.
- `role` (String, default: "admin"): Role of the admin.
- `secretKey` (String, required, unique): Unique secret key for admin authentication.
- `createdAt` (DateTime, default: now()): Timestamp of admin creation.
- `updatedAt` (DateTime, default: now()): Timestamp of last update.

## BannedUser

Stores information about banned users.

- `id` (String, required): Unique identifier for the banned user entry.
- `userId` (String, required): ID of the banned user.
- `bannedTime` (DateTime, required): Timestamp of when the user was banned.
- `reason` (String, required): Reason for banning the user.

## DataSource

Defines the database configuration.

- `provider` (String, required): Provider for the database (mongodb).
- `url` (String, required): URL of the MongoDB database.

# User Authentication 

## Register

Registers a new user in the system.

### Endpoint

`POST /api/auth/register`

### Control Flow

1. Request body validation with `UserSchema`.
2. Checking for existing user with the same email or username.
3. Hashing the password and creating the user in the database.
4. Creating a user action log for registration.
5. Generating an authentication token.

### Request Body

- `name` (string, required): User's name.
- `username` (string, required): User's username.
- `email` (string, required): User's email address.
- `password` (string, required): User's password.
- `dob` (Date, required): User's date of birth.
- `place` (string, required): User's place of residence.
- `phoneNumber` (string, required): User's phone number.
- `secondaryEmail` (string, required): User's secondary email address.

### Response

- 200 OK: User registered successfully.
- 400 Bad Request: Invalid request body or email/username already in use.
- 500 Internal Server Error: If an unexpected error occurs.

## Login

Logs in an existing user.

### Endpoint

`POST /api/auth/login`

### Control Flow

1. Request body validation with `LoginSchema`.
2. Retrieving user from the database based on email or username.
3. Verifying the password.
4. Creating a new session if none exists.
5. Generating an authentication token.
6. Creating a user action log for login.

### Request Body

- `emailOrUsername` (string, required): User's email address or username.
- `password` (string, required): User's password.

### Response

- 200 OK: User logged in successfully.
- 400 Bad Request: Invalid email/username or password.
- 500 Internal Server Error: If an unexpected error occurs.

## Logout

Logs out an authenticated user.

### Endpoint

`POST /api/auth/logout`

### Control Flow

1. Checking if the user is authenticated.
2. Updating the session logout time in the database.
3. Creating a user action log for logout.
4. Clearing the authentication token.

### Response

- 200 OK: Logout successful.
- 401 Unauthorized: If user is not authenticated.
- 500 Internal Server Error: If an unexpected error occurs.

# Email Verification and User Data 
## Verify Email

Sends a verification email to the provided email address.

### Endpoint

`POST /api/users/verify-email`

### Control Flow

1. Rate limiting middleware (`Registerlimiter`): Controls the rate of requests to prevent abuse.
2. Controller: `verifyEmail`

### Request Body

- `email` (string, required): The email address to verify.

### Response

- 200 OK: Verification email sent successfully.
- 400 Bad Request: Invalid request or internal error.
- 404 Not Found: User not found.
- 500 Internal Server Error: If an unexpected error occurs.

## Verify Token

Verifies the email verification token sent to the user's email.

### Endpoint

`GET /api/users/verify-token/:token`

### Control Flow

- Controller: `verifyToken`

### Request Parameters

- `token` (string, required): The verification token.

### Response

- 200 OK: Email verified successfully.
- 400 Bad Request: Invalid or expired token.
- 500 Internal Server Error: If an unexpected error occurs.

## Get All Usernames

Retrieves usernames for all users in the system.

### Endpoint

`GET /api/users/all`

### Control Flow

- Controller: `getAllUsernames`

### Response

- 200 OK: Returns an array of user objects containing id and username.
- 500 Internal Server Error: If an unexpected error occurs.

## Get User by ID

Retrieves user data based on their ID.

### Endpoint

`GET /api/users/:id`

### Control Flow

- Controller: `getUserById`

### Request Parameters

- `id` (string, required): The ID of the user to retrieve.

### Response

- 200 OK: Returns user data.
- 400 Bad Request: Invalid user ID.
- 404 Not Found: User not found.
- 500 Internal Server Error: If an unexpected error occurs.

# User Management 

This documentation provides details about the User Management API endpoints.

## Delete User by ID

Deletes a user from the system based on their ID.

### Endpoint

`DELETE /api/users/:id`

### Control Flow

1. Rate limiting middleware (`Registerlimiter`): Controls the rate of requests to prevent abuse.
2. JWT authentication middleware (`jwtAuth`): Authenticates the request using JSON Web Tokens.
3. Session middleware (`sessionMiddleware`): Handles user session management.
4. Controller: `deleteUserById`

### Request Parameters

- `id` (string, required): The ID of the user to delete.

### Request Body

- `adminSecret` (string, required): The secret key for admin authentication.

### Response

- 200 OK: User deleted successfully.
- 400 Bad Request: Invalid user ID or missing admin secret.
- 403 Forbidden: Missing or invalid admin secret.
- 404 Not Found: User not found.
- 500 Internal Server Error: If an unexpected error occurs.

## Ban User by ID

Bans a user from the system based on their ID.

### Endpoint

`POST /api/users/:id/ban`

### Control Flow

1. JWT authentication middleware (`jwtAuth`): Authenticates the request using JSON Web Tokens.
2. Rate limiting middleware (`Registerlimiter`): Controls the rate of requests to prevent abuse.
3. Session middleware (`sessionMiddleware`): Handles user session management.
4. Controller: `banUserById`

### Request Parameters

- `id` (string, required): The ID of the user to ban.

### Request Body

- `adminSecret` (string, required): The secret key for admin authentication.
- `reason` (string, required): The reason for banning the user.

### Response

- 200 OK: User banned successfully.
- 400 Bad Request: Invalid user ID, missing admin secret, or invalid request body.
- 403 Forbidden: Missing or invalid admin secret.
- 404 Not Found: User not found.
- 500 Internal Server Error: If an unexpected error occurs.

## Unban User by ID

Unbans a user from the system based on their ID.

### Endpoint

`POST /api/users/:id/unban`

### Control Flow

1. Rate limiting middleware (`Registerlimiter`): Controls the rate of requests to prevent abuse.
2. JWT authentication middleware (`jwtAuth`): Authenticates the request using JSON Web Tokens.
3. Session middleware (`sessionMiddleware`): Handles user session management.
4. Controller: `unbanUserById`

### Request Parameters

- `id` (string, required): The ID of the user to unban.

### Request Body

- `adminSecret` (string, required): The secret key for admin authentication.

### Response

- 200 OK: User unbanned successfully.
- 400 Bad Request: Invalid user ID or missing admin secret.
- 403 Forbidden: Missing or invalid admin secret.
- 404 Not Found: User not found.
- 500 Internal Server Error: If an unexpected error occurs.

