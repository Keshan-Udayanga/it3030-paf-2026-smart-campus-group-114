import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>
            Smart Campus <span>Operations Hub</span>
          </h1>
          <p>
            A centralized platform to manage university resources, bookings,
            and maintenance requests efficiently. Built with modern
            technologies for a seamless and user-friendly experience.
          </p>

          <div className="hero-buttons">
            <a href="#resources" className="btn btn-primary">
              <Link to="/resources" className="btn btn-primary">
                Browse Resources
              </Link>
            </a>
            <a href="#booking" className="btn btn-secondary">
              Book a Resource
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;