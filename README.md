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
  Navigate to the backend folder:
  cd backend
  Install backend dependencies :using npm install
  Configure the database
  Set up a MySQL database.
  Edit config/db.js with your MySQL credentials (host, user, password, database).
  Run the backend server:  
  node server.js
  The backend will run at http://localhost:5000.
