import {
  useState,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { login } from "../api";
import ThemeToggle from "../components/common/ThemeToggle";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

     const response = await login({
  email: email.trim(),
  password,
});

      if (!response.token) {
        throw new Error(
          response.message || "Login failed."
        );
      }

      localStorage.setItem(
        "token",
        response.token
      );

      if (response.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        localStorage.setItem(
          "userEmail",
          response.user.email
        );
      }

      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">

      {/* =====================================================
          THEME TOGGLE
      ===================================================== */}

      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="login-container">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <section className="login-info">

          <Link
            to="/"
            className="login-logo"
          >
            <span className="login-logo-icon">
              ✈️
            </span>

            <span>
              AI TravelMate
            </span>
          </Link>

          <div className="login-info-content">

            <p className="login-eyebrow">
              WELCOME BACK
            </p>

            <h1>
              Your journey
              <br />
              continues
              <br />
              here.
            </h1>

            <p className="login-description">
              Sign in to access your trips,
              personalized itineraries, AI travel
              assistant, and destination
              recommendations.
            </p>

            <div className="login-features">

              <div className="login-feature">
                <div className="login-feature-icon">
                  🗺️
                </div>

                <div>
                  <h3>
                    Your trips in one place
                  </h3>

                  <p>
                    Access all your planned
                    journeys and travel details.
                  </p>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  🤖
                </div>

                <div>
                  <h3>
                    AI-powered planning
                  </h3>

                  <p>
                    Generate personalized
                    itineraries for your trips.
                  </p>
                </div>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  📍
                </div>

                <div>
                  <h3>
                    Discover more
                  </h3>

                  <p>
                    Explore places, hotels and
                    restaurants at your destination.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* =====================================================
            LOGIN CARD
        ===================================================== */}

        <section className="login-card">

          <div className="login-card-header">

            <div className="login-card-icon">
              👋
            </div>

            <p className="login-card-eyebrow">
              SIGN IN
            </p>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue your travel
              planning journey.
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {error && (
              <div className="login-error">
                <span>⚠️</span>

                <span>{error}</span>
              </div>
            )}


            {/* EMAIL */}

            <div className="login-form-group">

              <label htmlFor="login-email">
                Email address
              </label>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}

            <div className="login-form-group">

              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />

                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <span>→</span>
                </>
              )}
            </button>

          </form>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="login-divider">
            <span>OR</span>
          </div>


          {/* =================================================
              REGISTER
          ================================================= */}

          <p className="login-register-text">
            Don't have an account?

            <Link to="/register">
              Create one
            </Link>
          </p>


          {/* =================================================
              BACK
          ================================================= */}

          <Link
            to="/"
            className="login-back-link"
          >
            ← Back to landing page
          </Link>

        </section>

      </div>
    </main>
  );
}