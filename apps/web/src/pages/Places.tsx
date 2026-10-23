import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { FormEvent } from "react";

import { Link } from "react-router-dom";

import {
  getPlaces,
  type Place,
} from "../api";

import ThemeToggle from "../components/common/ThemeToggle";

import "./Places.css";

function formatCost(
  value: number | string | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Free";
  }

  const numericValue = Number(
    String(value).replace(/[^\d.]/g, "")
  );

  if (
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return "Free";
  }

  return `₹${numericValue.toLocaleString(
    "en-IN"
  )}`;
}

export default function Places() {
  const [places, setPlaces] =
    useState<Place[]>([]);

  const [destination, setDestination] =
    useState("");

  const [searchedDestination, setSearchedDestination] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchText, setSearchText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadPlaces(
    destinationValue?: string
  ) {
    try {
      setLoading(true);
      setError("");

      const data = await getPlaces(
        destinationValue
      );

      setPlaces(
        Array.isArray(data) ? data : []
      );

      setSelectedCategory("All");
      setSearchText("");
    } catch (err) {
      console.error(
        "Failed to load places:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load places."
      );

      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPlaces();
  }, []);

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const value =
      destination.trim();

    setSearchedDestination(value);

    void loadPlaces(
      value || undefined
    );
  }

  const categories = useMemo(() => {
    const unique =
      new Set<string>();

    places.forEach((place) => {
      if (place.category?.trim()) {
        unique.add(
          place.category.trim()
        );
      }
    });

    return [
      "All",
      ...Array.from(unique),
    ];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    const query =
      searchText.trim().toLowerCase();

    return places.filter((place) => {
      const categoryMatches =
        selectedCategory === "All" ||
        place.category ===
          selectedCategory;

      const searchMatches =
        !query ||
        place.name
          .toLowerCase()
          .includes(query) ||
        place.location
          .toLowerCase()
          .includes(query) ||
        place.description
          .toLowerCase()
          .includes(query) ||
        place.category
          .toLowerCase()
          .includes(query);

      return (
        categoryMatches &&
        searchMatches
      );
    });
  }, [
    places,
    selectedCategory,
    searchText,
  ]);

  return (
    <main className="places-page">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="places-navbar">
        <Link
          to="/home"
          className="places-brand"
        >
          <span className="places-brand-icon">
            🌍
          </span>

          <span>AI TravelMate</span>
        </Link>

        <nav className="places-nav">
          <Link to="/home">
            Home
          </Link>

          <Link to="/my-trips">
            My Trips
          </Link>

          <Link
            to="/places"
            className="active"
          >
            Places
          </Link>

          <ThemeToggle />
        </nav>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="places-hero">
        <div className="places-hero-content">
          <span className="places-eyebrow">
            DISCOVER THE WORLD
          </span>

          <h1>
            Places to Visit
            <span> 🌍</span>
          </h1>

          <p>
            Discover attractions, landmarks,
            experiences and hidden gems for
            your next adventure.
          </p>

          <form
            className="places-search"
            onSubmit={handleSearch}
          >
            <div className="places-search-input">
              <span>📍</span>

              <input
                type="text"
                value={destination}
                onChange={(event) =>
                  setDestination(
                    event.target.value
                  )
                }
                placeholder="Search a destination..."
              />

              {destination && (
                <button
                  type="button"
                  aria-label="Clear destination"
                  onClick={() =>
                    setDestination("")
                  }
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="submit"
              className="places-search-button"
            >
              🔍 Search
            </button>
          </form>

          <div className="places-quick-search">
            <span>
              Try:
            </span>

            <button
              type="button"
              onClick={() => {
                setDestination("Mumbai");
                setSearchedDestination("Mumbai");
                void loadPlaces("Mumbai");
              }}
            >
              Mumbai
            </button>

            <button
              type="button"
              onClick={() => {
                setDestination("Goa");
                setSearchedDestination("Goa");
                void loadPlaces("Goa");
              }}
            >
              Goa
            </button>

            <button
              type="button"
              onClick={() => {
                setDestination("Delhi");
                setSearchedDestination("Delhi");
                void loadPlaces("Delhi");
              }}
            >
              Delhi
            </button>
          </div>
        </div>

        <div className="places-hero-visual">
          <div className="places-orbit">
            🌎
          </div>

          <div className="places-floating one">
            📍 Attractions
          </div>

          <div className="places-floating two">
            ✨ Experiences
          </div>

          <div className="places-floating three">
            🗺️ Explore
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="places-content">

        <div className="places-heading-row">
          <div>
            <span>
              EXPLORE
            </span>

            <h2>
              {searchedDestination
                ? `Places in ${searchedDestination}`
                : "Popular Places"}
            </h2>

            <p>
              {loading
                ? "Finding places..."
                : `${filteredPlaces.length} ${
                    filteredPlaces.length === 1
                      ? "place"
                      : "places"
                  } available`}
            </p>
          </div>
        </div>

        {/* CATEGORY FILTER */}

        {!loading &&
          !error &&
          places.length > 0 && (
            <div className="places-filters">
              {categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      selectedCategory ===
                      category
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          )}

        {/* SEARCH INSIDE RESULTS */}

        {!loading &&
          !error &&
          places.length > 0 && (
            <div className="places-result-search">
              <span>
                🔎
              </span>

              <input
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
                placeholder="Search within these places..."
              />
            </div>
          )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="places-state">
            <div className="places-spinner" />

            <h3>
              Discovering places...
            </h3>

            <p>
              Please wait while we find
              interesting places for you.
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="places-state">
            <div className="places-state-icon">
              ⚠️
            </div>

            <h3>
              Unable to load places
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadPlaces(
                  searchedDestination ||
                    undefined
                )
              }
            >
              Try Again
            </button>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          places.length === 0 && (
            <div className="places-state">
              <div className="places-state-icon">
                🗺️
              </div>

              <h3>
                No places found
              </h3>

              <p>
                Try searching for another
                destination.
              </p>
            </div>
          )}

        {/* =================================================
            NO FILTER MATCH
        ================================================= */}

        {!loading &&
          !error &&
          places.length > 0 &&
          filteredPlaces.length === 0 && (
            <div className="places-state">
              <div className="places-state-icon">
                🔎
              </div>

              <h3>
                No matching places
              </h3>

              <p>
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setSelectedCategory(
                    "All"
                  );
                }}
              >
                Show All Places
              </button>
            </div>
          )}

        {/* =================================================
            PLACE GRID
        ================================================= */}

        {!loading &&
          !error &&
          filteredPlaces.length > 0 && (
            <div className="places-grid">
              {filteredPlaces.map(
                (place) => (
                  <article
                    key={place.id}
                    className="place-card"
                  >
                    <div className="place-card-image">
                      {place.imageUrl ? (
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="place-placeholder">
                          📍
                        </div>
                      )}

                      <span className="place-category">
                        {place.category}
                      </span>
                    </div>

                    <div className="place-card-body">
                      <h3>
                        {place.name}
                      </h3>

                      <div className="place-location">
                        <span>
                          📍
                        </span>

                        <span>
                          {place.location}
                        </span>
                      </div>

                      <p className="place-description">
                        {place.description}
                      </p>

                      <div className="place-card-footer">
                        <span>
                          💰{" "}
                          {formatCost(
                            place.estimatedCost
                          )}
                        </span>

                        <span>
                          📍{" "}
                          {place.destination}
                        </span>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="places-footer">
        <div>
          <strong>
            🌍 AI TravelMate
          </strong>

          <p>
            Discover more. Travel better.
          </p>
        </div>

        <div className="places-footer-links">
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
          © {new Date().getFullYear()} AI TravelMate
        </span>
      </footer>
    </main>
  );
}