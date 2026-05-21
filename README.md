# Dev_Tinder_App

A platform which connects developers with similar tech stacks and collaboration interests

## Project Overview

This is a Node.js backend application built with Express.js and MongoDB that handles user management and authentication for connecting developers.

## Learning Journey - Initial Concepts

We started by learning Express.js fundamentals:

- **Request Handlers**: Creating routes with GET, POST, PUT, PATCH, DELETE methods
- **Middleware**: Understanding middleware execution and order (e.g., `express.json()` for parsing JSON bodies)
- **Route Parameters & Query Parameters**: Using dynamic routes with `:param` and `req.query`

## Project Architecture

### Step 1: Database Setup

- **File**: `src/config/database.js`
- Connected MongoDB using Mongoose
- Created `connectDB()` function to establish database connection before server startup
- Connection string stored in environment variables (`MONGODB_URI`)
- Server waits for database connection before starting (`await connectDB()`)
- This ensures database is ready before accepting requests

### Step 2: User Model & Schema Validation

- **File**: `src/models/user.js`
- Created MongoDB schema with fields: `firstName`, `lastName`, `email`, `password`, `age`, `gender`, `photoUrl`, `about`, `skills`
- **Library**: Using `validator` npm package for robust data validation
- Implemented schema-level validation:
    - Email: unique, lowercase, trimmed, validated using `validator.isEmail()`
    - Password: required, validated using `validator.isStrongPassword()` (enforces strong password requirements)
    - FirstName: minimum length 8, maximum 20
    - Age: minimum 18
    - Gender: custom validator (only "male", "female", "others" allowed)
    - PhotoUrl: validated using `validator.isURL()` to ensure valid URL format, default image provided
    - About: default value provided
    - Skills: maximum 5 skills per user
    - Timestamps: auto-created for tracking creation/update time

### Step 3: Authentication Middleware

- **File**: `src/middlewares/auth.js`
- Created two middleware functions:
    - `adminAuthFunction`: Validates admin token from request headers
    - `userAuthFunction`: Validates user token from request headers
- Middleware checks authorization token and blocks unauthorized requests with 401 status

### Step 4: API Routes & Business Logic

- **File**: `src/server.js`
- Integrated database connection and middleware
- Built 5 main endpoints:

#### Signup Route (POST /signup)

- Accepts user data in request body
- Saves new user to MongoDB with schema validation
- Returns 201 on success, 400 on validation error

#### Get User by Email (GET /user/:email)

- Retrieves user profile using email as parameter
- Returns 404 if user not found, 200 on success

#### Feed Route (GET /feed)

- Fetches all users from database
- Returns complete list of users

#### Delete User (DELETE /user/:id)

- Deletes user by MongoDB ID
- Validates ID and returns 400 if invalid
- **Null Check**: Validates that operation returned a valid user before responding
- Prevents returning success for invalid IDs

#### Update User (PATCH /user/:userId)

- Only allows updates to specific fields: `photoUrl`, `about`, `gender`, `age`, `skills`, `firstName`, `lastName`
- Prevents unauthorized field updates
- Runs schema validators on update (`runValidators: true`)
- Returns updated user with `returnDocument: "after"` option
- **Null Check**: Validates that operation returned a valid user before responding
- Prevents returning success for invalid IDs

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: Validator.js (for email, URL, and password strength validation)
- **Port**: 7000

## Key Concepts Implemented

1. **Middleware Pattern**: Using `app.use()` for global middleware application
2. **Schema Validation**: Data integrity at database level
3. **Authentication**: Token-based access control
4. **RESTful API Design**: Standard HTTP methods for CRUD operations
5. **Error Handling**: Try-catch blocks with appropriate HTTP status codes
6. **MongoDB Operations**: CRUD operations using Mongoose methods
7. **Data Sanitization**: Schema-level validation ensures data integrity
    - All required fields are validated before saving to database
    - Custom validators prevent invalid data (e.g., gender validation, skills limit)
    - Third-party validation library (Validator.js) for industry-standard checks:
        - Email format validation with `isEmail()`
        - Strong password enforcement with `isStrongPassword()`
        - URL format validation with `isURL()` for photo uploads
    - This approach avoids repeating validation logic in every route handler
8. **API-Level Data Sanitization**: Only allows updates to whitelisted fields
    - Defined `ALLOWED_UPDATES` array: `photoUrl`, `about`, `gender`, `age`, `skills`, `firstName`, `lastName`
    - Validates that every field in request body is in the allowed list
    - Prevents unauthorized field modifications (e.g., prevents updating password, email, or other sensitive fields)
    - Throws error if any non-whitelisted field is attempted

## HTTP Status Codes Used

- **201 Created**: POST /signup - User successfully created
- **200 OK**: GET requests - Data retrieved successfully
- **404 Not Found**: GET /user/:email - User doesn't exist
- **400 Bad Request**: Validation errors, invalid IDs, or query failures
- **401 Unauthorized**: Invalid authentication tokens (auth middleware)

## Database Operations

- **User.findOne()**: Query single user by email
- **User.find({})**: Query all users (empty filter returns all)
- **User.findByIdAndDelete()**: Delete and return deleted document
- **User.findByIdAndUpdate()**: Update with schema validation and return options
    - `runValidators: true`: Apply schema validators during update
    - `returnDocument: "after"`: Return updated document instead of original

## Request Object Properties

- `req.body`: Parsed JSON data from request (via express.json() middleware)
- `req.params`: Dynamic route parameters (e.g., `:userId`, `:email`, `:id`)
- `req.headers`: Request headers including authorization tokens
- `req.query`: URL query parameters
