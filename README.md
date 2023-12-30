# BuildInnovation-Backend

## Overview

This project sets up an Express.js API with endpoints for user authentication and administrative functionalities. It utilizes MongoDB as the database and includes token-based authentication using middleware.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gaurav147-star/BuildInnovation-Backend.git
   ```

2. **Install dependencies:**

   ```bash
   cd your-repo
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

## Usage

1. **Run the server:**

   ```bash
   npm start
   ```

2. **Access the API:**

   The server will start at http://localhost:8000. You can use tools like Postman or cURL to interact with the following endpoints:

   - `POST /api/auth/signup`: User registration
   - `POST /api/auth/login`: User login
   - `PUT /api/auth/modifydetails`: Modify user details (requires authentication)
   - `DELETE /api/auth/deleteaccount`: Delete user account (requires authentication)
   - `POST /api/authadmin/signup`: Admin registration
   - `POST /api/authadmin/login`: Admin login
   - `GET /api/authadmin/getAllUser`: Get all users (requires admin authentication)
   - `PUT /api/authadmin/modifydetails`: Modify user details as admin (requires admin authentication)
   - `DELETE /api/authadmin/deleteaccount`: Delete user account as admin (requires admin authentication)

## Folder Structure

- `config`: Configuration files (e.g., database connection)
- `controllers`: Functions handling business logic
- `middleware`: Middleware functions (e.g., authentication)
- `routes`: Route definitions
- `models`: Data models for MongoDB

## Dependencies

- `express`: Web framework for Node.js
- `mongoose`: MongoDB object modeling tool
- `dotenv`: Environment variable management
- `cors`: Cross-Origin Resource Sharing
