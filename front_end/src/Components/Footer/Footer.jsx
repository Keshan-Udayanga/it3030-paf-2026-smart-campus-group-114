import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <h3>Brand<span>.io</span></h3>
          <p>Building modern, scalable, and beautifully designed web experiences.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>Email: hello@brand.io</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Brand.io. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;