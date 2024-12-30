import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginRegister.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");  // Clear previous error message

    try {
      const response = await axios.post("http://localhost:5000/users/register", {
        name: name,
        email: email,
        password: password,
      });

      if (response.status === 200) {
        toast.success("Registration Successful! Redirecting to login.", {
          position: "top-center",
          style: {
            background: "green",
            color: "white",
          },
          duration: 3000, // Toast duration of 3 seconds
        });

        // Use setTimeout to navigate after 3 seconds (duration of the toast)
        setTimeout(() => {
          navigate("/login");  // Redirect to login
        }, 3000);  // 3000ms is the duration the toast shows
      }
    } catch (error) {
      // Check if error response and error data exists, otherwise fallback to generic message
      const errorMsg = error.response && error.response.data
        ? error.response.data.message
        : "Registration failed. Please try again.";

      toast.error(errorMsg, {
        position: "top-center",
        style: {
          background: "red",
          color: "white",
        },
        duration: 3000,  // Show error toast for 3 seconds
      });
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{color:'black'}} htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          <label  style={{color:'black'}} htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
        <a href="/login" className="alt-link">
          Already have an account? Login
        </a>
      </form>

      {/* Toaster component goes here */}
      <Toaster />
    </div>
  );
}

export default Register;
