// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Check for the token in the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: "Access denied, no token provided." });
  }

  // Verify the token
  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // Token is valid, attach both user ID and email to the request
    req.userId = decoded.userId;
    req.email = decoded.email; // Add email to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = verifyToken;
