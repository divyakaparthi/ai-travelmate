import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getTrips,
  type Trip,
} from "../api";

import ThemeToggle from "../components/common/ThemeToggle";

import "./MyTrips.css";

type TripFilter =
  | "all"
  | "active"
  | "completed";

function getTripStatus(trip: Trip) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(trip.endDate);
  endDate.setHours(23, 59, 59, 999);

  return endDate >= today
    ? "active"
    : "completed";
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatBudget(value: number) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function MyTrips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<TripFilter>("all");

  async function loadTrips() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

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

  useEffect(() => {
    void loadTrips();
  }, []);

  const activeCount = useMemo(
    () =>
      trips.filter(
        (trip) =>
          getTripStatus(trip) === "active"
      ).length,
    [trips]
  );

  const completedCount = useMemo(
    () =>
      trips.filter(
        (trip) =>
          getTripStatus(trip) === "completed"
      ).length,
    [trips]
  );

  const filteredTrips = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return [...trips]
      .filter((trip) => {
        if (filter === "all") {
          return true;
        }

        return (
          getTripStatus(trip) === filter
        );
      })
      .filter((trip) => {
        if (!searchText) {
          return true;
        }

        const destination =
          trip.destination?.toLowerCase() ?? "";

        const preferences =
          trip.preferences?.toLowerCase() ?? "";

        return (
          destination.includes(searchText) ||
          preferences.includes(searchText)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() -
          new Date(b.startDate).getTime()
      );
  }, [trips, filter, search]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");

    navigate("/login");
  }

  return (
    <main className="mytrips-page">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="mytrips-navbar">
        <Link
          to="/home"
          className="mytrips-brand"
        >
          <span className="mytrips-brand-icon">
            ✈️
          </span>

          <span>AI TravelMate</span>
        </Link>

        <nav className="mytrips-nav">
          <Link
            to="/home"
            className="mytrips-nav-link"
          >
            Home
          </Link>

          <Link
            to="/my-trips"
            className="mytrips-nav-link active"
          >
            My Trips
          </Link>

          <Link
            to="/places"
            className="mytrips-nav-link"
          >
            Places
          </Link>

          <ThemeToggle />

          <button
            type="button"
            className="mytrips-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mytrips-hero">
        <div className="mytrips-hero-content">
          <span className="mytrips-eyebrow">
            YOUR TRAVEL COLLECTION
          </span>

          <h1>
            My Trips
            <span> ✈️</span>
          </h1>

          <p>
            Keep all your journeys organized,
            discover your plans, and continue
            exploring your next adventure.
          </p>
        </div>

        <button
          type="button"
          className="mytrips-plan-button"
          onClick={() => navigate("/")}
        >
          <span>＋</span>
          Plan New Trip
        </button>
      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      {!loading &&
        !error &&
        trips.length > 0 && (
          <section className="mytrips-stats">
            <div className="mytrips-stat-card">
              <span className="mytrips-stat-icon blue">
                🧳
              </span>

              <div>
                <small>
                  TOTAL TRIPS
                </small>

                <strong>
                  {trips.length}
                </strong>
              </div>
            </div>

            <div className="mytrips-stat-card">
              <span className="mytrips-stat-icon green">
                🌍
              </span>

              <div>
                <small>
                  ACTIVE TRIPS
                </small>

                <strong>
                  {activeCount}
                </strong>
              </div>
            </div>

            <div className="mytrips-stat-card">
              <span className="mytrips-stat-icon purple">
                ✅
              </span>

              <div>
                <small>
                  COMPLETED
                </small>

                <strong>
                  {completedCount}
                </strong>
              </div>
            </div>
          </section>
        )}

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      {!loading &&
        !error &&
        trips.length > 0 && (
          <section className="mytrips-toolbar">
            <div className="mytrips-search">
              <span>⌕</span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search your trips..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="mytrips-filters">
              <button
                type="button"
                className={
                  filter === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("all")
                }
              >
                All
              </button>

              <button
                type="button"
                className={
                  filter === "active"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("active")
                }
              >
                Active
              </button>

              <button
                type="button"
                className={
                  filter === "completed"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("completed")
                }
              >
                Completed
              </button>
            </div>
          </section>
        )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <section className="mytrips-state">
          <div className="mytrips-loader" />

          <h2>
            Loading your trips...
          </h2>

          <p>
            We're getting your travel plans
            ready.
          </p>
        </section>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (
        <section className="mytrips-state error">
          <div className="mytrips-state-icon">
            ⚠️
          </div>

          <h2>
            Unable to load your trips
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              void loadTrips()
            }
            className="mytrips-retry"
          >
            Try Again
          </button>
        </section>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        trips.length === 0 && (
          <section className="mytrips-empty">
            <div className="mytrips-empty-icon">
              🌍
            </div>

            <span>
              START YOUR JOURNEY
            </span>

            <h2>
              Your first adventure
              starts here.
            </h2>

            <p>
              You haven't created a trip yet.
              Plan your first journey and let AI
              create a personalized itinerary for
              you.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
            >
              ✨ Create My First Trip
            </button>
          </section>
        )}

      {/* =====================================================
          NO SEARCH RESULTS
      ===================================================== */}

      {!loading &&
        !error &&
        trips.length > 0 &&
        filteredTrips.length === 0 && (
          <section className="mytrips-state">
            <div className="mytrips-state-icon">
              🔎
            </div>

            <h2>
              No matching trips
            </h2>

            <p>
              Try another destination or
              change the filter.
            </p>

            <button
              type="button"
              className="mytrips-retry"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
            >
              Show All Trips
            </button>
          </section>
        )}

      {/* =====================================================
          TRIPS GRID
      ===================================================== */}

      {!loading &&
        !error &&
        filteredTrips.length > 0 && (
          <section className="mytrips-content">
            <div className="mytrips-results-heading">
              <div>
                <span>
                  YOUR JOURNEYS
                </span>

                <h2>
                  {filteredTrips.length}{" "}
                  {filteredTrips.length === 1
                    ? "trip"
                    : "trips"}
                </h2>
              </div>

              <button
                type="button"
                className="mytrips-refresh"
                onClick={() =>
                  void loadTrips()
                }
              >
                ↻ Refresh
              </button>
            </div>

            <div className="mytrips-grid">
              {filteredTrips.map(
                (trip) => {
                  const status =
                    getTripStatus(trip);

                  return (
                    <article
                      key={trip.id}
                      className="mytrip-card"
                    >
                      <div className="mytrip-card-banner">
                        <div className="mytrip-location-icon">
                          📍
                        </div>

                        <span
                          className={`mytrip-status ${status}`}
                        >
                          {status ===
                          "active"
                            ? "Active"
                            : "Completed"}
                        </span>
                      </div>

                      <div className="mytrip-card-body">
                        <span className="mytrip-destination-label">
                          DESTINATION
                        </span>

                        <h3>
                          {trip.destination}
                        </h3>

                        <div className="mytrip-date">
                          <span>
                            📅
                          </span>

                          <div>
                            <small>
                              TRAVEL DATES
                            </small>

                            <strong>
                              {formatDate(
                                trip.startDate
                              )}
                              {" → "}
                              {formatDate(
                                trip.endDate
                              )}
                            </strong>
                          </div>
                        </div>

                        <div className="mytrip-card-info-grid">
                          <div>
                            <small>
                              BUDGET
                            </small>

                            <strong>
                              {formatBudget(
                                trip.budget
                              )}
                            </strong>
                          </div>

                          <div>
                            <small>
                              TRAVELERS
                            </small>

                            <strong>
                              {trip.travelers}{" "}
                              {trip.travelers ===
                              1
                                ? "person"
                                : "people"}
                            </strong>
                          </div>
                        </div>

                        <div className="mytrip-interest-box">
                          <span>
                            ❤️
                          </span>

                          <div>
                            <small>
                              INTERESTS
                            </small>

                            <p>
                              {trip.preferences?.trim() ||
                                "No preferences specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mytrip-card-footer">
                        <Link
                          to={`/trips/${trip.id}`}
                          className="mytrip-view-button"
                        >
                          View Trip
                          <span>
                            →
                          </span>
                        </Link>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mytrips-footer">
        <div>
          <strong>
            ✈️ AI TravelMate
          </strong>

          <p>
            Plan smarter. Travel better.
          </p>
        </div>

        <div className="mytrips-footer-links">
          <Link to="/home">
            Home
          </Link>

          <Link to="/places">
            Places
          </Link>

          <Link to="/my-trips">
            My Trips
          </Link>
        </div>

        <span>
          © {new Date().getFullYear()} AI TravelMate
        </span>
      </footer>
    </main>
  );
}