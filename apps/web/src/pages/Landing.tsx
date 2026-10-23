import { Link } from "react-router-dom";

import ThemeToggle from "../components/common/ThemeToggle";

import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-page">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="landing-navbar">
        <Link to="/" className="landing-logo">
          <span className="logo-icon">🌍</span>
          <span>AI TravelMate</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features">Features</a>

          <a href="#how-it-works">
            How It Works
          </a>

          <Link
            to="/login"
            className="nav-login"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="nav-register"
          >
            Get Started
          </Link>

          <ThemeToggle />
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ✨ AI-powered travel planning
          </div>

          <h1>
            Plan your journey.
            <br />
            <span>Travel without limits.</span>
          </h1>

          <p className="hero-description">
            AI TravelMate creates personalized travel
            plans based on your destination, budget,
            dates and interests — all in one place.
          </p>

          <div className="hero-buttons">
            <Link
              to="/register"
              className="primary-button"
            >
              Start Planning
              <span>→</span>
            </Link>

            <Link
              to="/login"
              className="secondary-button"
            >
              I already have an account
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>🤖</strong>
              <span>AI Planning</span>
            </div>

            <div>
              <strong>📸</strong>
              <span>Place Recognition</span>
            </div>

            <div>
              <strong>🎙️</strong>
              <span>AI Voice Assistant</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            HERO VISUAL
        ===================================================== */}

        <div className="hero-visual">
          <div className="floating-card card-one">
            <span>📍</span>

            <div>
              <small>Destination</small>
              <strong>Explore India</strong>
            </div>
          </div>

          <div className="travel-globe">
            🌍
          </div>

          <div className="floating-card card-two">
            <span>✨</span>

            <div>
              <small>AI Itinerary</small>
              <strong>Ready for your trip!</strong>
            </div>
          </div>

          <div className="floating-card card-three">
            <span>💰</span>

            <div>
              <small>Budget</small>
              <strong>Smart planning</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="features-section"
      >
        <div className="section-heading">
          <span>POWERFUL FEATURES</span>

          <h2>
            Everything you need for
            <br />
            a better trip
          </h2>

          <p>
            From planning your itinerary to discovering
            places, AI TravelMate helps you throughout
            your journey.
          </p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon="🤖"
            title="AI Itinerary"
            description="Generate personalized day-by-day travel plans based on your dates, budget and preferences."
          />

          <FeatureCard
            icon="📍"
            title="Discover Places"
            description="Find interesting destinations, attractions and recommended places to visit."
          />

          <FeatureCard
            icon="📸"
            title="Photo Recognition"
            description="Upload a travel photo and let AI identify the place and provide useful information."
          />

          <FeatureCard
            icon="🏨"
            title="Hotels & Restaurants"
            description="Explore hotels and restaurants at your destination with useful travel information."
          />

          <FeatureCard
            icon="💰"
            title="Budget Planning"
            description="Keep your travel expenses organized with estimated costs for your trip."
          />

          <FeatureCard
            icon="🎙️"
            title="AI Voice Assistant"
            description="Talk to your travel assistant using voice and get help while planning your trip."
          />
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="how-section"
      >
        <div className="section-heading">
          <span>HOW IT WORKS</span>

          <h2>
            Your trip in three
            <br />
            simple steps
          </h2>
        </div>

        <div className="steps">
          <Step
            number="01"
            icon="🗺️"
            title="Tell us about your trip"
            description="Choose your destination, travel dates, budget, travelers and interests."
          />

          <Step
            number="02"
            icon="✨"
            title="Let AI plan it"
            description="Our AI creates a personalized itinerary designed around your travel preferences."
          />

          <Step
            number="03"
            icon="✈️"
            title="Enjoy your journey"
            description="Explore your itinerary, discover places and use your AI travel assistant."
          />
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-icon">
            ✈️
          </div>

          <h2>
            Your next adventure
            <br />
            starts here.
          </h2>

          <p>
            Create your personalized travel plan
            with AI TravelMate.
          </p>

          <Link
            to="/register"
            className="cta-button"
          >
            Start Planning for Free →
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="landing-footer">
        <div className="footer-brand">
          <div className="landing-logo">
            <span className="logo-icon">🌍</span>
            <span>AI TravelMate</span>
          </div>

          <p>
            Plan smarter. Travel better.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

          <Link to="/places">
            Places
          </Link>
        </div>

        <div className="footer-copy">
          © {new Date().getFullYear()} AI TravelMate
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
   ========================================================= */

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="feature-arrow">
        →
      </div>
    </article>
  );
}

/* =========================================================
   STEP
   ========================================================= */

type StepProps = {
  number: string;
  icon: string;
  title: string;
  description: string;
};

function Step({
  number,
  icon,
  title,
  description,
}: StepProps) {
  return (
    <article className="step">
      <div className="step-number">
        {number}
      </div>

      <div className="step-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  );
}