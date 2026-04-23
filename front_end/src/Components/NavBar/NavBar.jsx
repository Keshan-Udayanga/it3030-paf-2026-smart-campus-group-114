import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

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

    axios.get("http://localhost:8080/api/v1/notifications", {
    headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setNotifications(res.data))
    .catch(err => console.error(err));

    axios.get("http://localhost:8080/api/v1/notifications/unread-count", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUnreadCount(res.data))
    .catch(err => console.error(err));;
  };

  loadUser(); // initial load

  //POLLING every 5 sec
  const interval = setInterval(loadUser, 5000);

  // listen for login/logout changes
  window.addEventListener("authChanged", loadUser);

  //Outside Click Handler
  const handleClickOutside = (event) => {
    // avatar dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }

    // notification dropdown
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    clearInterval(interval);
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

  const markAsRead = (id) => {
    const token = localStorage.getItem("token");

    axios.put(
      `http://localhost:8080/api/v1/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      // update UI without reload
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );

      setUnreadCount(prev => Math.max(prev - 1, 0));
    })
    .catch(err => console.error(err));
  };

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

        {/* RIGHT - LOGIN BUTTON and Notification Bell */}
        <div className="navbar-actions">

          {!user ? (
            //NOT LOGGED IN
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          ) : (
            // LOGGED IN
            <>
              {/* Notification Bell */}
              <div className="notification-wrapper" ref={notificationRef}>
                <div 
                  className="notification-icon"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowDropdown(false);
                  }}
                >
                  <FiBell size={22} />

                  {unreadCount > 0 && (
                    <span className="badge">{unreadCount}</span>
                  )}
                </div>

                {showNotifications && (
                  <div className="notification-dropdown" >
                    <h4>Notifications</h4>

                    {notifications.length === 0 && <p>No notifications</p>}

                    {notifications.slice(0,5).map(n => (
                      <div 
                        key={n.id} 
                        className={`notification-item ${n.isRead ? "" : "unread"}`}
                      >
                        <p>{n.message}</p>
                        {!n.isRead && (
                          <button 
                            className="mark-read-btn"
                            onClick={() => markAsRead(n.id)}
                          >
                            <FiCheck size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="notification-footer">
                      <button onClick={() => navigate("/notifications")}>
                        View All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="user-avatar-wrapper" ref={dropdownRef}>
                <div 
                  className="user-avatar"
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    setShowNotifications(false);
                  }}
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
            </>
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