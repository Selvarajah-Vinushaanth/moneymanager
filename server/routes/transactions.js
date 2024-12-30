const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
    const router = require('express').Router();
  
    // Middleware to extract email from headers
    // const getEmailFromHeaders = (req) => {
    //   return req.headers.email || req.body.email; // Check for email in headers or body
    // };
  
    router.post('/transaction', (req, res) => {
        const { email, date, description, amount, type, category } = req.body;
      
        // Step 1: Check if email is provided
        if (!email) {
          return res.status(400).send('Email is required');
        }
      
        // Step 2: Find user_id based on email
        const getUserIdQuery = 'SELECT id FROM users WHERE email = ?';
        
        db.query(getUserIdQuery, [email], (err, result) => {
          if (err) {
            console.error('Error fetching user ID:', err);
            return res.status(500).send('Error fetching user ID');
          }
      
          if (result.length === 0) {
            return res.status(404).send('User not found');
          }
      
          const userId = result[0].id;
      
          // Step 3: Insert the transaction into the 'transactions' table
          const transactionQuery = `
            INSERT INTO transactions (user_id, date, description, amount, type, category)
            VALUES (?, ?, ?, ?, ?, ?)`;
      
          db.query(transactionQuery, [userId, date, description, amount, type, category], (err, result) => {
            if (err) {
              console.error('Error inserting transaction:', err);
              return res.status(500).send('Error adding transaction');
            }
      
            // Step 4: Update the user's balance (income or expenditure)
            const balanceColumn = type === 'income' ? 'income' : 'expenditure';
            const balanceQuery = `
              INSERT INTO balances (user_id, total_balance, income, expenditure)
              VALUES (?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE ${balanceColumn} = ${balanceColumn} + ?`;
      
            db.query(balanceQuery, [userId, 0, 0, 0, amount], (err) => {
              if (err) {
                console.error('Error updating balance:', err);
                return res.status(500).send('Error updating balance');
              }
      
              // Step 5: Update quarterly expenses table (if applicable)
              const quarter = getQuarter(date); // Assuming you want to track by quarter
              const expenseQuery = `
                INSERT INTO expenses (user_id, quarter, amount)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE amount = amount + ?`;
      
              db.query(expenseQuery, [userId, quarter, amount, amount], (err) => {
                if (err) {
                  console.error('Error inserting into expenses:', err);
                  return res.status(500).send('Error inserting into expenses');
                }
      
                // Step 6: Update the revenue table for the corresponding month
                const month = getMonth(date); // Get the month from the date
                const revenueQuery = `
                  INSERT INTO revenue (user_id, month, amount)
                  VALUES (?, ?, ?)
                  ON DUPLICATE KEY UPDATE amount = amount + ?`;
      
                db.query(revenueQuery, [userId, month, amount, amount], (err) => {
                  if (err) {
                    console.error('Error inserting into revenue:', err);
                    return res.status(500).send('Error inserting into revenue');
                  }
      
                  res.status(200).send('Transaction added successfully');
                });
              });
            });
          });
        });
      });
      
      // Function to get the quarter from the date
      function getQuarter(date) {
        const month = new Date(date).getMonth() + 1;
        if (month >= 1 && month <= 3) return 'Q1';
        if (month >= 4 && month <= 6) return 'Q2';
        if (month >= 7 && month <= 9) return 'Q3';
        return 'Q4'; // Q4 for months 10, 11, 12
      }
      
      // Function to get the month from the date
      function getMonth(date) {
        return new Date(date).toLocaleString('default', { month: 'long' }); // Get month name (e.g., "January")
      }
      return router;
  };
  