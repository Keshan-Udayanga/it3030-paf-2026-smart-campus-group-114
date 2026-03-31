import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to SmartCampus</h1>
        <p>
          Manage your university facilities, bookings, and incidents easily and efficiently.
        </p>
        <button className="hero-btn">Get Started</button>
      </div>
      <div className="hero-image">
        <img
          src="../../Assets/1.png"
          alt="Smart-Campus-Image"
        />
      </div>
    </section>
  );
};

export default HeroSection;