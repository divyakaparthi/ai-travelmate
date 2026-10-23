import {
  useState,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { register } from "../api";
import ThemeToggle from "../components/common/ThemeToggle";

import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await register(
        email.trim(),
        password
      );

      if (result?.token) {
        localStorage.setItem("token", result.token);
      }

      navigate("/home");
    } catch (err) {
      console.error("Registration failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">

      {/* Theme button */}
      <div className="register-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="register-container">

        {/* LEFT SIDE */}
        <section className="register-info">

          <Link to="/" className="register-logo">
            ✈️ <span>AI TravelMate</span>
          </Link>

          <div className="register-info-content">
            <p className="register-eyebrow">
              GET STARTED
            </p>

            <h1>
              Plan.
              <br />
              Explore.
              <br />
              Experience.
            </h1>

            <p className="register-description">
              Create your TravelMate account and keep
              all your travel plans organized in one place.
            </p>

            <div className="register-features">

              <div className="register-feature">
                <div className="feature-icon">🗺️</div>

                <div>
                  <h3>Personalized travel planning</h3>
                  <p>
                    Create trips based on your destination,
                    dates, budget and interests.
                  </p>
                </div>
              </div>

              <div className="register-feature">
                <div className="feature-icon">💰</div>

                <div>
                  <h3>Plan around your budget</h3>
                  <p>
                    Keep your travel expenses organized
                    while planning your journey.
                  </p>
                </div>
              </div>

              <div className="register-feature">
                <div className="feature-icon">🤖</div>

                <div>
                  <h3>AI-powered itineraries</h3>
                  <p>
                    Let AI help you build your day-by-day
                    travel experience.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* RIGHT SIDE */}
        <section className="register-card">

          <div className="register-card-header">

            <div className="register-card-icon">
              ✨
            </div>

            <p className="register-card-eyebrow">
              START YOUR JOURNEY
            </p>

            <h2>
              Create your account
            </h2>

            <p>
              Start planning smarter and exploring more
              with AI TravelMate.
            </p>

          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
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
            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={loading}
              />

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Enter your password again"
                autoComplete="new-password"
                disabled={loading}
              />

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="register-divider">
            <span>OR</span>
          </div>

          <p className="register-login">
            Already have an account?

            <Link to="/login">
              Sign in
            </Link>
          </p>

          <Link
            to="/"
            className="register-back"
          >
            ← Back to landing page
          </Link>

        </section>

      </div>
    </div>
  );
}