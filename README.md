# Money Manager - Advanced Financial Management System

## Overview

The **Money Manager** is an advanced web application designed to help users manage their personal finances. Built with **React**, **Node.js/Express**, and **MySQL**, the app allows users to securely track income and expenses, visualize financial data through charts, and manage their personal budgets in a user-friendly interface.

## Features

- **User Authentication**: Secure login and registration using JWT authentication.
- **Transaction Management**: Add, view, and manage income and expense transactions.
- **Financial Dashboard**: Overview of the user’s finances, including balance, recent transactions, and graphs.
- **Data Visualization**: Graphical representation of income vs expenses.
- **Responsive Design**: Optimized for mobile and desktop devices.

## Tech Stack

- **Frontend**: React.js, Chart.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Version Control**: Git/GitHub

## Installation Guide

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MySQL** (v8 or higher)


  
### Clone the Repository
  git clone https://github.com/Selvarajah-Vinushaanth/moneymanager/tree/master
  cd money-manager

### Backend Setup
  Navigate to the backend folder.
  cd backend.
  Install backend dependencies :
  using npm install
  Configure the database.
  Set up a MySQL database.
  Edit config/db.js with your MySQL credentials (host, user, password, database).
  Run the backend server:  
  node server.js.
  The backend will run at http://localhost:5000.

### Frontend Setup
  Navigate to the frontend folder:
  cd ../frontend
  Install frontend dependencies:
  npm install
  Run the frontend server:
  npm start
  The frontend will run at http://localhost:3000.
  
### Usage
  Sign Up: New users can register using the Register page.
  Log In: Returning users can log in with their credentials to access the dashboard.
  Dashboard: View a detailed overview of your financial status, including charts of income and expenses.
  Transactions: Add, manage, and view your transactions (both income and expenses).

## API Endpoints
  Here are the primary API endpoints used in the application:

### Authentication
  POST /api/auth/login: Log in a user with email and password.
  POST /api/auth/register: Register a new user with email, password, and other necessary details.
### Transactions
  POST /api/transactions: Add a new transaction (either income or expense).
  GET /api/transactions: Retrieve all transactions for the authenticated user.

### Contributing
  Contributions are welcome! To contribute:
  
  Fork the repository.
  Create a new branch (git checkout -b feature-name).
  Commit your changes (git commit -am 'Add feature').
  Push to the branch (git push origin feature-name).
  Open a pull request.
  
### Acknowledgments
  React.js - For building the frontend.
  Node.js/Express.js - For the backend server.
  MySQL - For the database.
  Chart.js - For generating charts and graphs.
  JWT - For secure authentication.
