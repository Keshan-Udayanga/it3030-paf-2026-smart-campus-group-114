import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      {/* FULL 100VH HERO SECTION */}
      <section className="c-hero">
        <div className="c-hero-bg-overlay"></div>
        
        <div className="c-hero-content">
          <span className="s-tag">Support Center</span>
          <h1>Get in <span>Touch</span></h1>
          <p>
            Have a technical issue, a feature suggestion, or need a custom 
            integration for your department? Our operational experts are ready to help.
          </p>

          {/* NEW: QUICK INFO CARDS TO FILL SPACE */}
          <div className="c-hero-shortcuts">
            <div className="shortcut-card">
              <span>⚡</span>
              <p>Avg. Response <br /><strong>Under 2 Hours</strong></p>
            </div>
            <div className="shortcut-card">
              <span>🛠️</span>
              <p>Technical <br /><strong>24/7 Support</strong></p>
            </div>
            <div className="shortcut-card">
              <span>🎓</span>
              <p>Dedicated <br /><strong>Faculty Help</strong></p>
            </div>
          </div>

          
        </div>
      </section>

      {/* FORM SECTION (Scrolls into view) */}
      <section className="c-content" id="contact-form">
        <div className="c-grid">
          {/* ... (Keep your existing LEFT SIDE: CONTACT INFO) */}
          <div className="c-info-side">
            <div className="c-info-card">
              <div className="c-icon">📍</div>
              <div className="c-details">
                <h4>Main Office</h4>
                <p>Faculty of Engineering, University Campus</p>
              </div>
            </div>
            <div className="c-info-card active-glow">
              <div className="c-icon">📧</div>
              <div className="c-details">
                <h4>Email Us</h4>
                <p>ops-support@smartcampus.edu</p>
              </div>
            </div>
            <div className="c-info-card">
              <div className="c-icon">📞</div>
              <div className="c-details">
                <h4>Hotline</h4>
                <p>+94 11 234 5678</p>
              </div>
            </div>
            <div className="c-status-tag">
              <span className="dot"></span> System Status: <strong>Operational</strong>
            </div>
          </div>

          {/* ... (Keep your existing RIGHT SIDE: CONTACT FORM) */}
          <div className="c-form-side">
            <form className="c-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>University Email</label>
                <input type="email" placeholder="john@uni.lk" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select>
                  <option>Select Department</option>
                  <option>Engineering</option>
                  <option>Computing</option>
                  <option>Business</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="5" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="c-submit-btn">
                Send Message <span>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;