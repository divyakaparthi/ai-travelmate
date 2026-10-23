import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getTrips,
  type Trip,
} from "../api";
import TripForm from "../components/trip/TripForm";
import ThemeToggle from "../components/common/ThemeToggle";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userEmail =
    localStorage.getItem("userEmail") ||
    "Traveler";

  useEffect(() => {
    async function loadTrips() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getTrips();

        setTrips(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Failed to load trips:",
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : "Failed to load trips.";

        if (
          message
            .toLowerCase()
            .includes("authorization") ||
          message
            .toLowerCase()
            .includes("token") ||
          message.includes("401")
        ) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadTrips();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(
      "userEmail"
    );

    navigate("/login");
  }

  return (
    <div className="home-page">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="home-navbar">
        <Link
          to="/home"
          className="home-brand"
        >
          <span className="home-brand-icon">
            ✈️
          </span>

          <span>
            AI TravelMate
          </span>
        </Link>

        <nav className="home-nav">
          <Link
            to="/home"
            className="home-nav-link active"
          >
            Home
          </Link>

          <Link
            to="/my-trips"
            className="home-nav-link"
          >
            My Trips
          </Link>

          <Link
            to="/places"
            className="home-nav-link"
          >
            Explore Places
          </Link>

          <ThemeToggle />

          <div className="home-profile">
            <div className="home-avatar">
              {userEmail
                .charAt(0)
                .toUpperCase()}
            </div>

            <span className="home-email">
              {userEmail}
            </span>

            <button
              type="button"
              className="home-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main className="home-main">
        <section className="home-hero">
          <div className="hero-content">

            <div className="hero-badge">
              ✨ AI-POWERED TRAVEL PLANNING
            </div>

            <h1>
              Plan your
              <span> perfect trip.</span>
            </h1>

            <p>
              Discover amazing destinations,
              organize your journeys, create
              personalized itineraries, and get
              intelligent travel recommendations
              with AI TravelMate.
            </p>

            <div className="hero-actions">
             <a
  href="#trip-planner"
  className="hero-primary"
>
  ✨ Plan a New Trip
  <span>→</span>
</a>

              <Link
                to="/my-trips"
                className="hero-secondary"
              >
                🧳 View My Trips
              </Link>
            </div>

            <div className="hero-trust">
              <div>
                <span>🤖</span>
                <strong>AI Planning</strong>
              </div>

              <div>
                <span>📍</span>
                <strong>Smart Discovery</strong>
              </div>

              <div>
                <span>📸</span>
                <strong>Place Recognition</strong>
              </div>
            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="hero-visual">
            <div className="hero-glow"></div>

            <div className="travel-preview">
              <div className="travel-preview-top">
                <span>
                  🌍
                </span>

                <small>
                  YOUR NEXT ADVENTURE
                </small>
              </div>

              <div className="travel-preview-image">
                <div className="preview-orbit">
                  ✈️
                </div>

                <div className="preview-destination">
                  <small>
                    Explore the world
                  </small>

                  <strong>
                    Your journey
                    starts here.
                  </strong>
                </div>
              </div>

              <div className="travel-preview-footer">
                <div>
                  <span>🤖</span>

                  <div>
                    <small>
                      AI Planner
                    </small>

                    <strong>
                      Ready to plan
                    </strong>
                  </div>
                </div>

                <span className="preview-arrow">
                  →
                </span>
              </div>
            </div>

            <div className="visual-pill pill-one">
              📍 Discover places
            </div>

            <div className="visual-pill pill-two">
              ✨ Smart itinerary
            </div>

            <div className="visual-pill pill-three">
              💰 Budget friendly
            </div>
          </div>
        </section>
        <section
  id="trip-planner"
  className="home-planner-section"
>
  <div className="section-heading">
    <span>PLAN YOUR NEXT ADVENTURE</span>

    <h2>
      Where do you want to go?
    </h2>

    <p>
      Tell us about your trip and AI TravelMate
      will help you plan the rest.
    </p>
  </div>

  <TripForm />
</section>

        {/* =====================================================
            QUICK FEATURES
        ===================================================== */}

        <section className="quick-section">
          <div className="section-heading">
            <span>
              EVERYTHING IN ONE PLACE
            </span>

            <h2>
              Your travel companion,
              powered by AI.
            </h2>

            <p>
              Plan your trip, discover places,
              manage your journeys and get
              travel assistance from one dashboard.
            </p>
          </div>

          <div className="quick-grid">
            <article className="quick-card">
              <div className="quick-icon blue">
                🤖
              </div>

              <h3>
                AI Itineraries
              </h3>

              <p>
                Generate personalized
                day-by-day travel plans based
                on your budget, dates and
                interests.
              </p>

              <Link to="/">
                Start planning →
              </Link>
            </article>

            <article className="quick-card">
              <div className="quick-icon purple">
                📍
              </div>

              <h3>
                Discover Places
              </h3>

              <p>
                Explore attractions,
                landmarks and interesting
                destinations for your journey.
              </p>

              <Link to="/places">
                Explore places →
              </Link>
            </article>

            <article className="quick-card">
              <div className="quick-icon orange">
                📸
              </div>

              <h3>
                Recognize Places
              </h3>

              <p>
                Upload a travel photo and use
                AI to identify the destination
                and learn more about it.
              </p>

              <Link to="/my-trips">
                View trips →
              </Link>
            </article>
          </div>
        </section>

        {/* =====================================================
            RECENT TRIPS
        ===================================================== */}

        <section className="recent-section">
          <div className="section-heading-row">
            <div>
              <span>
                YOUR JOURNEYS
              </span>

              <h2>
                Recent Trips
              </h2>

              <p>
                Continue exploring your saved
                travel plans.
              </p>
            </div>

            <Link
              to="/my-trips"
              className="view-all-link"
            >
              View all trips →
            </Link>
          </div>

          {loading ? (
            <div className="home-state-card">
              <div className="home-spinner"></div>

              <h3>
                Loading your trips...
              </h3>

              <p>
                Please wait while we get
                your travel plans.
              </p>
            </div>
          ) : error ? (
            <div className="home-state-card error">
              <div className="state-icon">
                ⚠️
              </div>

              <h3>
                Unable to load your trips
              </h3>

              <p>
                {error}
              </p>

              <Link
                to="/my-trips"
                className="state-button"
              >
                Open My Trips
              </Link>
            </div>
          ) : trips.length === 0 ? (
            <div className="home-state-card">
              <div className="state-icon">
                🗺️
              </div>

              <h3>
                Your journey starts here
              </h3>

              <p>
                You haven't created a trip yet.
                Start planning your first
                adventure.
              </p>

              <Link
                to="/"
                className="state-button"
              >
                Create My First Trip →
              </Link>
            </div>
          ) : (
            <div className="trip-grid">
              {trips
                .slice(0, 3)
                .map((trip) => (
                  <Link
                    key={trip.id}
                    to={`/trips/${trip.id}`}
                    className="trip-card"
                  >
                    <div className="trip-card-top">
                      <div className="trip-location">
                        📍
                      </div>

                      <span>
                        View trip →
                      </span>
                    </div>

                    <h3>
                      {trip.destination}
                    </h3>

                    <div className="trip-details">
                      <div>
                        <small>
                          DATES
                        </small>

                        <strong>
                          {new Date(
                            trip.startDate
                          ).toLocaleDateString(
                            "en-IN"
                          )}

                          {" → "}

                          {new Date(
                            trip.endDate
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </strong>
                      </div>

                      <div>
                        <small>
                          BUDGET
                        </small>

                        <strong>
                          ₹
                          {Number(
                            trip.budget
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="trip-bottom">
                      <span>
                        👥{" "}
                        {trip.travelers}
                        {" "}
                        {trip.travelers === 1
                          ? "Traveler"
                          : "Travelers"}
                      </span>

                      <span>
                        {trip.preferences ||
                          "No preferences"}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </section>

        {/* =====================================================
            AI BANNER
        ===================================================== */}

        <section className="ai-section">
          <div className="ai-content">
            <span className="ai-label">
              🤖 AI TRAVEL ASSISTANT
            </span>

            <h2>
              Your personal
              <span>
                travel companion.
              </span>
            </h2>

            <p>
              From discovering hidden gems to
              creating day-by-day itineraries,
              AI TravelMate helps make every
              journey easier.
            </p>

            <Link
              to="/my-trips"
              className="ai-button"
            >
              Explore My Trips →
            </Link>
          </div>

          <div className="ai-visual">
            <div className="ai-orbit">
              <div>
                ✈️
              </div>
            </div>

            <span className="ai-card card-a">
              🗺️ Itinerary
            </span>

            <span className="ai-card card-b">
              📸 Place Recognition
            </span>

            <span className="ai-card card-c">
              💬 AI Assistant
            </span>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">
        <div>
          <strong>
            ✈️ AI TravelMate
          </strong>

          <p>
            Plan smarter. Travel better.
            Explore more.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/home">
            Home
          </Link>

          <Link to="/my-trips">
            My Trips
          </Link>

          <Link to="/places">
            Places
          </Link>
        </div>

        <span>
          © {new Date().getFullYear()}
          {" "}
          AI TravelMate
        </span>
      </footer>
    </div>
  );
}