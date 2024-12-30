const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  const router = require('express').Router();

  // Register route
  router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error." });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists." });
      }
  
      // Hash the password before saving it
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: "Error hashing password." });
        }
  
        // Insert user into the database
        const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(query, [name, email, hashedPassword], (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Error saving user." });
          }
          return res.status(200).json({ message: "Registration successful." });
        });
      });
    });
  });
  // Login route
  // Login route
router.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    // Query user by email
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error." });
        }
  
        if (results.length > 0) {
          const user = results[0];
  
          // Compare password with hashed password in DB
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
              // Generate a JWT token
              const token = jwt.sign({ userId: user.id }, "secret_key", {
                expiresIn: "1h", // 1-hour expiry
              });
  
              // Send the token back in the response
              res.status(200).json({ message: "Login successful", token });
            } else {
              res.status(401).json({ message: "Invalid email or password" });
            }
          });
        } else {
          res.status(401).json({ message: "Invalid email or password" });
        }
      }
    );
  });
  

  return router;
};
