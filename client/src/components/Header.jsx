import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate instead of useHistory
import "../styles/HeadFoot.css";
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome styles

function Header() {
  const navigate = useNavigate();  // Use navigate instead of history

  const handleLogout = () => {
    // Remove email and authToken from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("authToken");

    // Redirect the user to the login page after logging out
    navigate("/login");  // Use navigate to programmatically redirect
  };

  return (
    <header className="header">
      <div className="logo">
        <span className="animated-logo">💰💰💰</span> Money Manager <span className="animated-logo">💰💰💰</span>
      </div>
      <nav className="nav-links">
        <a href="/dashboard">
          <i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard
        </a>
        
        <a href="/register">
          <i className="fa fa-user-plus" aria-hidden="true"></i> Register
        </a>
        <a href="/login">
          <i className="fa fa-sign-in" aria-hidden="true"></i> Login
        </a>
        {/* <a href="#!" onClick={handleLogout}>
          <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
        </a> */}
      </nav>
    </header>
  );
}

export default Header;
