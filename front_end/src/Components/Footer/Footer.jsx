import "./Footer.css";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About / Brand */}
        <div className="footer-section">
          <h2>SmartCampus</h2>
          <p>
            Modern campus management system. Manage bookings, incidents, and notifications seamlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Facilities</li>
            <li>Bookings</li>
            <li>Tickets</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@smartcampus.edu</p>
          <p>Phone: +94 77 123 4567</p>
          <p>Address: Colombo, Sri Lanka</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaLinkedinIn />
            <FaInstagram />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 SmartCampus. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;