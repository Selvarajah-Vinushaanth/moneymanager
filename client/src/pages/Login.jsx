import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import toast, { Toaster } from "react-hot-toast"; // Import toast for error/success messages
import "../styles/LoginRegister.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // Store JWT token in localStorage
        localStorage.setItem("authToken", response.data.token); // Store the JWT token
        localStorage.setItem("email", email);

        toast.success("Login successful! Redirecting to the dashboard.", {
          position: "top-center",
          style: {
            background: "green",
            color: "white",
          },
          duration: 3000, // Duration of 3 seconds for the toast
        });

        // Use setTimeout to navigate to dashboard after the toast disappears
        setTimeout(() => {
          navigate("/dashboard");  // Redirect to dashboard page
        }, 3000);  // 3000ms is the duration of the toast
      }
    } catch (error) {
      // Enhanced error handling to display custom messages from the backend
      const errorMsg = error.response && error.response.data
        ? error.response.data.message
        : "Invalid email or password."; // Fallback message

      setErrorMessage(errorMsg);

      toast.error(errorMsg, {
        position: "top-center",
        style: {
          background: "red",
          color: "white",
        },
        duration: 3000, // Error toast duration of 3 seconds
      });
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{color:'black'}} htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label style={{color:'black'}} htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit">Login</button>
        <a href="/register" className="alt-link">
          Don't have an account? Register
        </a>
      </form>

      {/* Toaster component goes here */}
      <Toaster />
    </div>
  );
}

export default Login;
