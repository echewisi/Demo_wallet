# Demo Credit Wallet Service

Demo Credit Wallet Service is a comprehensive Node.js TypeScript application that provides a secure wallet management system for mobile lending applications. It enables users to create accounts, fund their wallets, transfer funds between users, and withdraw money. The service integrates with Lendsqr's Adjutor Karma API for blacklist verification and implements robust security measures including password hashing, input validation, and proper error handling.

## 🚀 Features

- **User Account Management**: Secure user registration with email validation
- **Wallet Operations**: Fund, transfer, and withdraw funds with transaction logging
- **Karma Blacklist Integration**: Prevents onboarding of blacklisted users via Adjutor API
- **Security**: Password hashing, input validation, and authentication middleware
- **Database Transactions**: ACID-compliant operations for financial transactions
- **Comprehensive Testing**: Unit tests with positive and negative scenarios
- **Error Handling**: Custom error classes with proper HTTP status codes
- **API Documentation**: Well-documented RESTful endpoints

## Table of Contents

- [Demo Wallet](#demo-wallet)
  - [Table of Contents](#table-of-contents)
  - [IMPORTANT NOTICE!!](#important-notice)
  - [Project overview on Notion](#project-overview-on-notion)
  - [Features](#features)
  - [ERD DIAGRAM](#erd-diagram)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [DATABASE SETUP](#database-setup)
    - [RUNNING THE APPLICATION](#running-the-application)
    - [Running Tests](#running-tests)
  - [API ENDPOINTS](#api-endpoints)
    - [User Endpoints](#user-endpoints)
    - [Wallet Endpoints](#wallet-endpoints)
    - [Contributing](#contributing)
    - [License](#license)
    - [Explanation](#explanation)


## IMPORTANT NOTICE!!
aside from the minor tweaks coming from the lendsqr adjudtor  karma api(the field for `identity` doesent seem to read the any identity provided. except for the very one depicted in the documentation), the api does the other functionalities right.

## Project overview on Notion
you can find the project overview on google docs:
```https://docs.google.com/document/d/1pzTbOLgSmeFKbDV-fRvm2i4TailzN01sVFRSokhOc2c/edit?usp=sharing```

## Features

- User account creation
- Wallet funding
- Funds transfer between wallets
- Funds withdrawal
- Password hashing for security
- Database migrations and seeds

## 📊 Entity Relationship Diagram (ERD)

The database schema consists of three main entities with the following relationships:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      USERS      │       │     WALLETS     │       │  TRANSACTIONS   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, UUID)   │◄──────┤ wallet_id (PK)  │◄──────┤ id (PK, INT)    │
│ name (VARCHAR)  │       │ user_id (FK)    │       │ from_wallet_id  │
│ email (VARCHAR) │       │ balance (DEC)   │       │ to_wallet_id    │
│ phone (VARCHAR) │       │ created_at      │       │ amount (DEC)    │
│ password (VARCHAR)      │ updated_at      │       │ type (VARCHAR)  │
│ wallet_id (FK)  │       └─────────────────┘       │ created_at      │
│ created_at      │                                 │ updated_at      │
│ updated_at      │                                 └─────────────────┘
└─────────────────┘

URL TO THE FULL IMAGE IMAGE DIAGRAM CAN BE FOUND HERE: https://dbdesigner.page.link/m4SnghNuT9pf8Lhv9
```

### Relationships:
- **Users ↔ Wallets**: One-to-One relationship (each user has exactly one wallet)
- **Wallets ↔ Transactions**: One-to-Many relationship (each wallet can have multiple transactions)
- **Foreign Key Constraints**: 
  - `wallets.user_id` references `users.id` (CASCADE DELETE)
  - `transactions.from_wallet_id` references `wallets.wallet_id` (CASCADE DELETE)
  - `transactions.to_wallet_id` references `wallets.wallet_id` (CASCADE DELETE)

### Key Design Decisions:
- **UUID Primary Keys**: Ensures globally unique identifiers and prevents enumeration attacks
- **Decimal Precision**: Balance and amounts stored with 14 digits total, 2 decimal places
- **Cascade Deletes**: Ensures data integrity when users are deleted
- **Transaction Logging**: Complete audit trail for all financial operations

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v14 or later)
- npm (v6 or later)
- MySQL (or any other SQL database supported by Knex)
- NOTE: the cloud instance i used for this project is ``clever cloud`` you can see their website here: ``https://www.clever-cloud.com/`` you can visit, set up your add-on, and then retrieve your necessary credentials

### Installation

1. Clone the repository:

```bash
git clone https://github.com/echewisi/Demo_wallet
```
```bash 
cd demo_wallet
```
2. install dependencies
``` npm install```

3. Create a .env file in the root directory and configure your environment variables:
    ```DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    ADJUTOR_SECRET_KEY=
    PORT=
    FAUX_TOKEN= 
    ```

### DATABASE SETUP

1. create the database
   (if you choose local setup)
   ```CREATE DATABASE demo_wallet_db;```

2. run database migrations
   ```npx knex migrate:latest --knexfile src/knexfile.ts```

### RUNNING THE APPLICATION

```npm start```
The server will start on http://localhost:3000 if you didnt provide a port in the .env file.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Test Coverage:**
- Unit tests for all services, models, and controllers
- Positive and negative test scenarios
- Mocked external API calls
- Database transaction testing

## 🚀 Deployment

### Render Deployment

1. **Create Render Account** and connect your GitHub repository:
   - Visit [render.com](https://render.com)
   - Sign up and connect your GitHub account
   - Import your repository

2. **Create Web Service**:
   - Choose "Web Service" from the dashboard
   - Connect your GitHub repository
   - Set the following configuration:
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Set Environment Variables**:
   - `NODE_ENV=production`
   - `DB_HOST=your-database-host`
   - `DB_USER=your-database-user`
   - `DB_PASSWORD=your-database-password`
   - `DB_NAME=your-database-name`
   - `ADJUTOR_SECRET_KEY=your-adjutor-api-key`
   - `FAUX_TOKEN=your-faux-authentication-token`
   - `PORT` (Render will set this automatically)

4. **Deploy**:
   - Render will automatically deploy when you push to your main branch
   - The service will be available at: `https://<candidate-name>-lendsqr-be-test.onrender.com`

5. **Run Migrations** (if needed):
   - Use Render's shell feature to run: `npm run migrate`

### Alternative: Heroku Deployment

If you prefer Heroku, follow the original instructions in the README.

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name

# Local Database (for development)
LOCAL_DB_HOST=localhost
LOCAL_DB_USER=root
LOCAL_DB_PASSWORD=your-local-password
LOCAL_DB_NAME=demo_wallet_db

# API Keys
ADJUTOR_SECRET_KEY=your-adjutor-api-key
FAUX_TOKEN=your-faux-authentication-token

# Application
PORT=3000
NODE_ENV=development
```

### Test Environment Variables

Create a `.env.test` file for testing:

```env
NODE_ENV=test
TEST_DB_HOST=localhost
TEST_DB_USER=root
TEST_DB_PASSWORD=your-test-password
TEST_DB_NAME=demo_wallet_test
ADJUTOR_SECRET_KEY=test-secret-key
FAUX_TOKEN=test-faux-token
```

## 🔌 API Endpoints

### User Endpoints

#### `POST /api/users/create-account`
Creates a new user account with wallet.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "wallet_id": "wallet-uuid-here"
  }
}
```

**Response (Error - 400/403):**
```json
{
  "success": false,
  "message": "User is in the Karma blacklist. Cannot be onboarded!",
  "error": "BlacklistError"
}
```

### Wallet Endpoints

#### `POST /api/wallets/fund-wallet`
Adds funds to a user's wallet.

**Request Body:**
```json
{
  "userId": "user-uuid-here",
  "amount": 100.50,
  "password": "SecurePass123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Account funded successfully!",
  "data": {
    "newBalance": 100.50
  }
}
```

#### `POST /api/wallets/transfer-funds`
Transfers funds between wallets.

**Request Body:**
```json
{
  "userId": "sender-uuid-here",
  "recipientWalletId": "recipient-wallet-uuid-here",
  "amount": 50.00,
  "password": "SecurePass123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Transfer successful.",
  "data": {
    "transactionId": 123
  }
}
```

#### `POST /api/wallets/withdraw-funds`
Withdraws funds from a user's wallet.

**Request Body:**
```json
{
  "userId": "user-uuid-here",
  "amount": 25.00,
  "password": "SecurePass123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Withdrawal successful.",
  "data": {
    "newBalance": 75.50
  }
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ErrorType"
}
```

**Common Error Types:**
- `ValidationError` (400): Invalid input data
- `AuthenticationError` (401): Invalid credentials
- `NotFoundError` (404): Resource not found
- `InsufficientFundsError` (400): Insufficient balance
- `BlacklistError` (403): User is blacklisted
- `ConflictError` (409): Resource already exists


## 🏗️ Architecture & Design Patterns

### Project Structure
```
src/
├── controllers/          # Request handlers
├── services/            # Business logic layer
├── models/              # Data access layer
├── routes/              # API route definitions
├── middlewares/         # Custom middleware functions
├── utils/               # Utility functions and helpers
├── migrations/          # Database migration files
├── tests/               # Test files
│   ├── __tests__/       # Test suites
│   └── setup.ts         # Test configuration
├── knexfile.ts          # Database configuration
└── app.ts               # Application entry point
```

### Design Patterns Implemented

1. **Repository Pattern**: Data access is abstracted through model functions
2. **Service Layer Pattern**: Business logic is separated from controllers
3. **Custom Error Classes**: Structured error handling with proper HTTP status codes
4. **Middleware Pattern**: Authentication and validation middleware
5. **Factory Pattern**: Database connection configuration

### Code Quality Principles

- **DRY (Don't Repeat Yourself)**: Reusable utility functions and shared error handling
- **SOLID Principles**: Single responsibility, dependency inversion
- **Clean Architecture**: Separation of concerns across layers
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Error Handling**: Comprehensive error handling with custom error classes

### Security Measures

- **Password Hashing**: bcrypt with salt rounds (12)
- **Input Validation**: Comprehensive validation for all inputs
- **SQL Injection Prevention**: Parameterized queries via Knex.js
- **Authentication**: Faux token-based authentication middleware
- **Blacklist Integration**: Karma API integration for user verification

### Database Design

- **ACID Compliance**: Database transactions for financial operations
- **Referential Integrity**: Foreign key constraints with cascade deletes
- **UUID Primary Keys**: Globally unique identifiers
- **Audit Trail**: Complete transaction logging
- **Decimal Precision**: Proper handling of monetary values

## 🧪 Testing Strategy

### Test Types
- **Unit Tests**: Individual function testing with mocked dependencies
- **Integration Tests**: API endpoint testing with real database
- **Error Scenario Testing**: Negative test cases for error handling

### Test Coverage
- Services: Business logic validation
- Controllers: Request/response handling
- Models: Database operations
- Utilities: Helper function validation

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Async/Await**: Non-blocking operations throughout
- **Transaction Scoping**: Minimal transaction duration for better concurrency

## 🔧 Development Guidelines

### Naming Conventions
- **Variables**: camelCase (e.g., `userWallet`, `transactionId`)
- **Functions**: camelCase with descriptive names (e.g., `validateUserRegistration`)
- **Classes**: PascalCase (e.g., `ValidationError`, `WalletError`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)

### API Design
- **RESTful Endpoints**: Semantic resource naming
- **Consistent Responses**: Standardized success/error response format
- **HTTP Status Codes**: Proper status code usage
- **Request Validation**: Input validation at controller level

### Git Workflow
- **Conventional Commits**: Descriptive commit messages
- **Feature Branches**: Separate branches for new features
- **Pull Requests**: Code review process
- **Semantic Versioning**: Version management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lendsqr**: For providing the Adjutor Karma API
- **Express.js**: Web framework
- **Knex.js**: SQL query builder
- **TypeScript**: Type safety and developer experience
- **Jest**: Testing framework


