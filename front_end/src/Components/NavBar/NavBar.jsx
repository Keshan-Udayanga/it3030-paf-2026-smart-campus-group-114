import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import './NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
  const loadUser = () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (token && name) {
      setUser({ name });
    } else {
      setUser(null);
    }
  };

  loadUser(); // initial load

  // 👇 listen for login/logout changes
  window.addEventListener("authChanged", loadUser);

  //Outside Click Handler
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    window.removeEventListener("authChanged", loadUser);
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, []);

  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      window.dispatchEvent(new Event("authChanged"));
      window.location.href = "/";
    };

  const handleDashboard = () => {
    window.location.href = "/user-dashboard";
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">

        {/* LEFT - LOGO */}
        <div className="navbar-logo">
          <img src="/assets/logo.png" alt="Brand Logo" />
        </div>

        {/* CENTER - MENU */}
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/resources" className="nav-link" onClick={toggleMenu}>
            Resources
          </Link>
          <a href="#services" className="nav-link" onClick={toggleMenu}>Resources</a>
          <a href="#services" className="nav-link" onClick={toggleMenu}>Services</a>
          <a href="#contact" className="nav-link" onClick={toggleMenu}>Contact Us</a>
        </div>

        {/* RIGHT - LOGIN BUTTON */}
        <div className="navbar-actions">

          {!user ? (
            // NOT LOGGED IN
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          ) : (
            // LOGGED IN
            <div className="user-avatar-wrapper" ref={dropdownRef}>
              <div 
                className="user-avatar"
                onClick={() => setShowDropdown(true)}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {showDropdown && (
                <div className="user-dropdown">
                  <p className="user-name">{user.name}</p>
                  <button onClick={handleDashboard}>Dashboard</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* HAMBURGER */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;