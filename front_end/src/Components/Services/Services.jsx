import React from "react";
import "./Services.css";
import { Link } from "react-router-dom";


const Services = () => {
  return (
    <div className="services-container">
      {/* 1. MINIMALIST HERO */}
      <section className="s-hero">
        <div className="s-hero-inner">
          <span className="s-tag">Platform Capabilities</span>
          <h1>Seamless Campus <span>Management</span></h1>
          <p>Precision tools designed for the modern university ecosystem.</p>
        </div>
      </section>

      {/* 2. MODERN SERVICE LAYOUT */}
      <section className="s-content">
        <div className="s-card-large">
          <div className="s-text">
            <div className="s-num">01</div>
            <h2>Resource Reservation</h2>
            <p>Smart scheduling for lecture halls, laboratories, and specialized equipment with real-time sync across all faculty departments.</p>
            <div className="s-features">
              <span>● Conflict Prevention</span>
              <span>● Live Availability</span>
              <span>● Access Control</span>
            </div>
            <Link to="/booking" className="s-btn-text">Explore Booking →</Link>
          </div>
          <div className="s-visual">
            <div className="s-glass-box">🏢</div>
          </div>
        </div>

        <hr className="lineHr" />

        <div className="s-card-large reverse">
          <div className="s-text">
            <div className="s-num">02</div>
            <h2>Maintenance Hub</h2>
            <p>A centralized ticket system to report infrastructure issues. Track repair status from submission to completion with instant alerts.</p>
            <div className="s-features">
              <span>● Photo Reporting</span>
              <span>● Priority AI Routing</span>
              <span>● Status Updates</span>
            </div>
            <Link to="/tickets" className="s-btn-text">Report Issue →</Link>
          </div>
          <div className="s-visual">
            <div className="s-glass-box emerald">🛠️</div>
          </div>
        </div>
      </section>

      {/* 3. GRID SECTION */}
      <section className="s-grid-section">
        <div className="s-grid-header">
          <h2>Administrative Excellence</h2>
          <div className="s-divider"></div>
        </div>
        <div className="s-grid">
          <div className="s-mini-card">
            <div className="s-icon-sm">📊</div>
            <h3>Inventory</h3>
            <p>Monitor campus assets and high-value equipment.</p>
          </div>
          <div className="s-mini-card">
            <div className="s-icon-sm">📡</div>
            <h3>Live Stats</h3>
            <p>Real-time data on room occupancy and energy.</p>
          </div>
          <div className="s-mini-card">
            <div className="s-icon-sm">🛡️</div>
            <h3>Security</h3>
            <p>Integrated campus safety and access protocols.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;