# Demo Wallet

Demo Wallet is a Node.js application that provides a wallet management system. It allows users to create accounts, fund their wallets, transfer funds, and withdraw money. The project uses Knex.js for database migrations and queries, bcrypt for password hashing, and Express.js for handling HTTP requests.

## Table of Contents

- [Demo Wallet](#demo-wallet)
  - [Table of Contents](#table-of-contents)
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


## Project overview on Notion
you can find the project overview on notion:
```https://www.notion.so/DEMO-WALLET-OVERVIEW-63a7af23be604086babab90762ee3aee?pvs=4```

## Features

- User account creation
- Wallet funding
- Funds transfer between wallets
- Funds withdrawal
- Password hashing for security
- Database migrations and seeds

## ERD DIAGRAM

the detailed ERD diagram with the project overview and structure can be found below:
``https://dbdesigner.page.link/m4SnghNuT9pf8Lhv9``

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

```npm test```

## API ENDPOINTS

### User Endpoints
**POST /users/create-account**
Description: Create a new user
Body Parameters: name, email, phone, password

### Wallet Endpoints
**POST /wallets/fund-wallet**
_Description_: Transfer funds to user wallet
_Body Parameters_: userId, amount, password

**POST /wallets/transfer-funds**
_Description_: Transfer funds between wallets
_Body Parameters_: userId, recipient_wallet_Id, amount, password

**POST /wallets/withdraw-funds**
_Description_: Withdraw funds from a wallet
_Body Parameters_: userId, amount, password


### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License
This project is licensed under the MIT License 


### Explanation

- **Project Purpose**: The README starts by explaining the purpose of the project and listing its features.
- **Setup Instructions**: Detailed steps to set up the project, including prerequisites, installation steps, database setup, and how to configure environment variables.
- **Running the Application**: Instructions on how to start the application.
- **Running Tests**: Instructions on how to run the unit tests.
- **Project Structure**: An overview of the project's directory structure to help understand where different components are located.
- **API Endpoints**: A list of available API endpoints with their descriptions and required parameters.
- **Contributing**: Information on how to contribute to the project.
- **License**: Licensing information.

This README should provide a comprehensive guide for anyone who wants to understand, set up, run, or contribute to your project.


