import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./NavBar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = () => setIsOpen(false); // closes menu on link click

  return (
    <nav className="navbar">
      <h2 className="logo">SmartCampus</h2>

      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li onClick={handleLinkClick}>Home</li>
        <li onClick={handleLinkClick}>Facilities</li>
        <li onClick={handleLinkClick}>Bookings</li>
        <li onClick={handleLinkClick}>Tickets</li>
        <li className="login-mobile" onClick={handleLinkClick}>Login</li>
      </ul>

      <button className="login-btn">Login</button>

      <div className="mobile-menu-icon" onClick={toggleMenu}>
        {isOpen ? <FiX /> : <FiMenu />}
      </div>
    </nav>
  );
};

export default Navbar;