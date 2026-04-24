import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              Smart Campus <span>Operations Hub</span>
            </h1>
            <p>
              A centralized platform to manage university resources, bookings,
              and maintenance requests efficiently.
            </p>

            <div className="hero-buttons">
              <Link to="/resources" className="btn btn-primary">
                Browse Resources
              </Link>
              <Link to="/tickets" className="btn btn-secondary">
                Raise a Ticket
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-bar">
        <div className="stat-item">
          <h3>50+</h3>
          <p>Venues</p>
        </div>
        <div className="stat-item">
          <h3>1.2k</h3>
          <p>Active Requests</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Support</p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features" id="features">
        <div className="section-header">
          <h2>Our Core Services</h2>
          <div className="underline"></div>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">🏢</div>
            <h3>Resource Booking</h3>
            <p>Book lecture halls, labs, and equipment with real-time availability checks.</p>
          </div>
          
          <div className="feature-card">
            <div className="icon">🛠️</div>
            <h3>Maintenance Tracking</h3>
            <p>Report facility issues and track repair progress from your dashboard.</p>
          </div>
          
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Operations Analytics</h3>
            <p>Gain insights into campus resource usage and optimize scheduling.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <h2>Ready to streamline your workflow?</h2>
        <p>Join hundreds of faculty and students using Smart Campus today.</p>
        <Link to="/signup" className="btn btn-primary">Get Started for Free</Link>
      </section>
    </div>
  );
};

export default Home;