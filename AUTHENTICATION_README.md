# Authentication & Authorization System

This backend now includes a complete authentication and authorization system using JWT tokens, bcrypt for password hashing, and role-based access control.

## Features

- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based authorization (user/admin)
- ✅ Input validation with express-validator
- ✅ Protected routes middleware
- ✅ User profile management
- ✅ Password change functionality
- ✅ Admin-only routes

## Setup

### 1. Environment Variables

Make sure your `.env` file includes:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### 2. Database

The system automatically creates a `users` table when the server starts. The table structure:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Public Routes (No Authentication Required)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user" // optional, defaults to "user"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Protected Routes (Authentication Required)

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass456"
}
```

### Admin-Only Routes

#### Get All Users
```http
GET /api/auth/users
Authorization: Bearer <admin-jwt-token>
```

#### Delete User
```http
DELETE /api/auth/users/:id
Authorization: Bearer <admin-jwt-token>
```

## How to Use Authentication in Your Routes

### 1. Basic Authentication (User or Admin)
```typescript
import { authenticate, requireAuth } from '../middleware/auth';

router.get('/protected-route', authenticate, requireAuth, yourController);
```

### 2. Admin-Only Routes
```typescript
import { authenticate, requireAdmin } from '../middleware/auth';

router.get('/admin-route', authenticate, requireAdmin, yourController);
```

### 3. Custom Role Authorization
```typescript
import { authenticate, authorize } from '../middleware/auth';

router.get('/custom-route', authenticate, authorize(['admin', 'moderator']), yourController);
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## JWT Token Usage

### 1. Include Token in Requests
Add the JWT token to the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 2. Token Structure
The JWT token contains:
```json
{
  "userId": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Password Requirements

- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

## Username Requirements

- 3-50 characters
- Only letters, numbers, and underscores allowed

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Input Validation**: Comprehensive validation for all inputs
4. **Role-Based Access**: Different permissions for users and admins
5. **Token Verification**: Tokens are verified on every protected request
6. **User Existence Check**: Verifies user still exists in database

## Error Handling

The system handles various error scenarios:
- Invalid credentials
- Expired tokens
- Missing permissions
- Validation errors
- Database errors

## Testing the Authentication

### 1. Start the server
```bash
npm run dev
```

### 2. Register a user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 4. Use the token
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your-token-here>"
```

## Creating an Admin User

To create an admin user, include the role in the registration:

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "AdminPass123",
  "role": "admin"
}
```

## Protecting Your Existing Routes

To protect your existing fighter routes, you can:

1. Use the existing `fighterRoutes.ts` for public access
2. Use `protectedFighterRoutes.ts` for authenticated access
3. Or modify your existing routes to include authentication middleware

Example of protecting existing routes:
```typescript
// In your fighterRoutes.ts
import { authenticate, requireAuth } from '../middleware/auth';

router.post('/fighters', authenticate, requireAuth, getFighterCard);
```

This ensures only authenticated users can access the fighter data. 