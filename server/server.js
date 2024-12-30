const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const userRoutes = require('./routes/userRouter');
const dashboards=require('./routes/Dashboard');
const transactions=require('./routes/transactions');

dotenv.config();
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// MySQL Database Connection Setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'user1',  // Change this to the correct user
  password: '123', // Set the correct password
  database: 'moneymanager'
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// User routes

app.use('/users', userRoutes(db));
app.use('/users', dashboards(db));
app.use('/users', transactions(db));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
