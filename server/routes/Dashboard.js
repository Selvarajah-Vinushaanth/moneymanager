const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

module.exports = (db) => {
    const router = require('express').Router();
  
    // Middleware to extract email from headers
    const getEmailFromHeaders = (req) => {
      return req.headers.email || req.body.email; // Check for email in headers or body
    };
  
    router.get("/dashboard", (req, res) => {
      const userEmail = getEmailFromHeaders(req); // Get the email from headers
      if (!userEmail) {
        return res.status(400).send("Email is required.");
      }
  
      const query = `
        SELECT * FROM balances 
        WHERE user_id = (SELECT id FROM users WHERE email = ?) 
        ORDER BY created_at DESC LIMIT 1
      `;
      console.log(userEmail);
    
      db.query(query, [userEmail], (err, result) => {
        if (err) {
          console.error("Error fetching balance data:", err);
          return res.status(500).send("Error fetching balance data.");
        }
        res.json(result[0]);
      });
    });
    
    // Revenue route
    router.get("/revenue", (req, res) => {
      const userEmail = getEmailFromHeaders(req); // Get the email from headers
      if (!userEmail) {
        return res.status(400).send("Email is required.");
      }
  
      const query = `
        SELECT * FROM transactions 
        WHERE user_id = (SELECT id FROM users WHERE email = ?)
      `;
    
      db.query(query, [userEmail], (err, result) => {
        if (err) {
          console.error("Error fetching revenue data:", err);
          return res.status(500).send("Error fetching revenue data.");
        }
        res.json(result);
      });
    });
    router.get("/income", (req, res) => {
      const userEmail = getEmailFromHeaders(req); // Get the email from headers
      if (!userEmail) {
        return res.status(400).send("Email is required.");
      }
    
      const query = `
        SELECT * FROM transactions
        WHERE user_id = (SELECT id FROM users WHERE email = ?)
        AND type = 'income'
      `;
      
      db.query(query, [userEmail], (err, result) => {
        if (err) {
          console.error("Error fetching income data:", err);
          return res.status(500).send("Error fetching income data.");
        }
        res.json(result); // Send the expenses data to the frontend
      });
    });
    router.get('/balance', (req, res) => {
      const email = req.headers.email; // Get email from the request headers
    
      if (!email) {
        return res.status(400).send('Email is required');
      }
    
      const query = `
        SELECT
          MONTH(date) AS month,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
        FROM transactions
        WHERE user_id = (SELECT id FROM users WHERE email = ?)  -- Filter by user_id based on email
        GROUP BY MONTH(date)
        ORDER BY month ASC;
      `;
    
      db.query(query, [email], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error calculating balance data');
        }
    
        let balance = 0;
        const revenueData = results.map(item => {
          balance += item.income - item.expense;
          return {
            month: item.month,
            amount: balance,
            // type:item.type
          };
        });
    
        res.json(revenueData);
      });
    });
    
    // Expenses route
    router.get("/expenses", (req, res) => {
      const userEmail = getEmailFromHeaders(req); // Get the email from headers
      if (!userEmail) {
        return res.status(400).send("Email is required.");
      }
    
      const query = `
        SELECT * FROM transactions
        WHERE user_id = (SELECT id FROM users WHERE email = ?)
        AND type = 'expense'
      `;
      
      db.query(query, [userEmail], (err, result) => {
        if (err) {
          console.error("Error fetching expenses data:", err);
          return res.status(500).send("Error fetching expenses data.");
        }
        res.json(result); // Send the expenses data to the frontend
      });
    });
    
    // Transactions route
    router.get("/transactions", (req, res) => {
      const userEmail = getEmailFromHeaders(req); // Get the email from headers
      if (!userEmail) {
        return res.status(400).send("Email is required.");
      }
  
      const query = `
        SELECT * FROM transactions 
        WHERE user_id = (SELECT id FROM users WHERE email = ?) 
        ORDER BY date DESC
      `;
    
      db.query(query, [userEmail], (err, result) => {
        if (err) {
          console.error("Error fetching transactions:", err);
          return res.status(500).send("Error fetching transactions.");
        }
        res.json(result);
      });
    });
  
    // Helper function to extract email from headers
// const getEmailFromHeaders = (req) => req.headers.email;

// Endpoint to get total income for a user by email
router.get('/total-income', (req, res) => {
  const email = getEmailFromHeaders(req); // Email passed in headers
  if (!email) {
    return res.status(400).send('Email is required.');
  }

  const getUserQuery = `SELECT id FROM users WHERE email = ?`;

  db.query(getUserQuery, [email], (err, userResults) => {
    if (err) return res.status(500).send(err);
    if (userResults.length === 0) return res.status(404).json({ error: 'User not found' });

    const userId = userResults[0].id;

    const incomeQuery = `
      SELECT COALESCE(SUM(amount), 0) AS total_income 
      FROM transactions 
      WHERE user_id = ? AND type = 'income'
    `;
    db.query(incomeQuery, [userId], (err, incomeResults) => {
      if (err) return res.status(500).send(err);
      res.json({ total_income: incomeResults[0].total_income });
    });
  });
});

// Endpoint to get total expenses for a user by email
router.get('/total-expenses', (req, res) => {
  const email = getEmailFromHeaders(req); // Email passed in headers
  if (!email) {
    return res.status(400).send('Email is required.');
  }

  const getUserQuery = `SELECT id FROM users WHERE email = ?`;

  db.query(getUserQuery, [email], (err, userResults) => {
    if (err) return res.status(500).send(err);
    if (userResults.length === 0) return res.status(404).json({ error: 'User not found' });

    const userId = userResults[0].id;

    const expenseQuery = `
      SELECT COALESCE(SUM(amount), 0) AS total_expenses 
      FROM transactions 
      WHERE user_id = ? AND type = 'expense'
    `;
    db.query(expenseQuery, [userId], (err, expenseResults) => {
      if (err) return res.status(500).send(err);
      res.json({ total_expenses: expenseResults[0].total_expenses });
    });
  });
});

// Endpoint to get balance for a user by email
router.get('/balances', (req, res) => {
  const email = getEmailFromHeaders(req); // Email passed in headers
  if (!email) {
    return res.status(400).send('Email is required.');
  }

  const getUserQuery = `SELECT id FROM users WHERE email = ?`;

  db.query(getUserQuery, [email], (err, userResults) => {
    if (err) return res.status(500).send(err);
    if (userResults.length === 0) return res.status(404).json({ error: 'User not found' });

    const userId = userResults[0].id;

    const balanceQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS balance
      FROM transactions 
      WHERE user_id = ?
    `;
    db.query(balanceQuery, [userId], (err, balanceResults) => {
      if (err) return res.status(500).send(err);
      res.json({ balance: balanceResults[0].balance });
    });
  });
});

    return router;
  };
  