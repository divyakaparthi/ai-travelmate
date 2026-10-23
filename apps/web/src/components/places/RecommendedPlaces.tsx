import { useEffect, useState } from "react";

type RecommendedPlace = {
  id?: string;
  name: string;
  category?: string;
  description?: string;
  location?: string;
  estimatedCost?: number | string;
  cost?: number | string;
  rating?: number | string;
};

type RecommendedPlacesProps = {
  destination?: string;
};

export default function RecommendedPlaces({
  destination,
}: RecommendedPlacesProps) {
  const [places, setPlaces] = useState<
    RecommendedPlace[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      const cleanDestination =
        destination?.trim();

      if (!cleanDestination) {
        setPlaces([]);
        setError(
          "Destination is not available."
        );
        return;
      }

      try {
        setLoading(true);
        setError("");

        const url =
          `http://localhost:5000/api/places?destination=${encodeURIComponent(
            cleanDestination
          )}`;

        console.log(
          "RECOMMENDED PLACES:",
          cleanDestination
        );

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to load places (${response.status})`
          );
        }

        const result =
          await response.json();

        if (cancelled) {
          return;
        }

        /*
         * Support the common response formats:
         *
         * { places: [...] }
         * { data: [...] }
         * [...]
         */

        const receivedPlaces =
          Array.isArray(result)
            ? result
            : Array.isArray(result?.places)
            ? result.places
            : Array.isArray(result?.data)
            ? result.data
            : [];

        setPlaces(receivedPlaces);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Recommended places error:",
          err
        );

        setPlaces([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load recommended places."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPlaces();

    return () => {
      cancelled = true;
    };
  }, [destination]);

  // =====================================================
  // No destination
  // =====================================================

  if (!destination?.trim()) {
    return (
      <section style={styles.wrapper}>
        <Header />

        <div style={styles.message}>
          Destination information is not available.
        </div>
      </section>
    );
  }

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section style={styles.wrapper}>
        <Header />

        <div style={styles.loading}>
          <div style={styles.loadingIcon}>
            🔎
          </div>

          <strong>
            Finding places in {destination}...
          </strong>

          <p>
            Getting recommended places for your
            destination.
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section style={styles.wrapper}>
        <Header />

        <div style={styles.error}>
          <div style={styles.errorIcon}>
            ⚠️
          </div>

          <strong>
            Unable to load recommendations
          </strong>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // No places
  // =====================================================

  if (places.length === 0) {
    return (
      <section style={styles.wrapper}>
        <Header />

        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            📍
          </div>

          <strong>
            No recommendations found
          </strong>

          <p>
            We couldn't find recommended places
            for {destination} right now.
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Recommendations
  // =====================================================

  return (
    <section style={styles.wrapper}>
      <Header />

      <div style={styles.grid}>
        {places.map((place, index) => {
          const cost =
            place.estimatedCost ??
            place.cost;

          return (
            <article
              key={
                place.id ||
                `${place.name}-${index}`
              }
              style={styles.placeCard}
            >
              <div style={styles.placeIcon}>
                📍
              </div>

              <div style={styles.placeContent}>
                <div style={styles.placeTop}>
                  <h3 style={styles.placeName}>
                    {place.name}
                  </h3>

                  {place.rating !==
                    undefined && (
                    <span
                      style={styles.rating}
                    >
                      ⭐ {place.rating}
                    </span>
                  )}
                </div>

                {place.category && (
                  <span
                    style={styles.category}
                  >
                    {place.category}
                  </span>
                )}

                {place.description && (
                  <p
                    style={
                      styles.description
                    }
                  >
                    {place.description}
                  </p>
                )}

                {place.location && (
                  <p
                    style={styles.location}
                  >
                    📍 {place.location}
                  </p>
                )}

                {cost !== undefined && (
                  <p
                    style={styles.cost}
                  >
                    💰 Estimated cost: ₹
                    {Number(cost).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// =====================================================
// Header
// =====================================================

function Header() {
  return (
    <div style={styles.header}>
      <div>
        <p style={styles.label}>
          EXPLORE
        </p>

        <h2 style={styles.title}>
          📍 Recommended Places
        </h2>

        <p style={styles.subtitle}>
          Discover interesting places to visit
          during your trip.
        </p>
      </div>
    </div>
  );
}

// =====================================================
// Styles
// =====================================================

const styles: Record<
  string,
  React.CSSProperties
> = {
  wrapper: {
    width: "100%",
    overflow: "hidden",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  header: {
    padding: "28px 30px 20px",
  },

  label: {
    margin: "0 0 6px",
    color: "#6366f1",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
  },

  title: {
    margin: 0,
    color: "#111827",
    fontSize: "28px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    lineHeight: 1.6,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    padding: "0 30px 30px",
  },

  placeCard: {
    display: "flex",
    gap: "15px",
    padding: "20px",
    borderRadius: "17px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
  },

  placeIcon: {
    width: "45px",
    height: "45px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    backgroundColor: "#eef2ff",
    fontSize: "22px",
  },

  placeContent: {
    minWidth: 0,
    flex: 1,
  },

  placeTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },

  placeName: {
    margin: 0,
    color: "#111827",
    fontSize: "18px",
  },

  rating: {
    flexShrink: 0,
    padding: "4px 7px",
    borderRadius: "7px",
    backgroundColor: "#fff7ed",
    color: "#c2410c",
    fontSize: "12px",
    fontWeight: 700,
  },

  category: {
    display: "inline-block",
    marginTop: "7px",
    padding: "5px 9px",
    borderRadius: "999px",
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
    fontSize: "11px",
    fontWeight: 700,
  },

  description: {
    margin: "10px 0 0",
    color: "#64748b",
    lineHeight: 1.55,
    fontSize: "14px",
  },

  location: {
    margin: "10px 0 0",
    color: "#475569",
    fontSize: "13px",
    fontWeight: 600,
  },

  cost: {
    margin: "8px 0 0",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: 700,
  },

  message: {
    margin: "0 25px 25px",
    padding: "25px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    textAlign: "center",
  },

  loading: {
    margin: "0 25px 25px",
    padding: "40px 25px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    textAlign: "center",
  },

  loadingIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  error: {
    margin: "0 25px 25px",
    padding: "35px 25px",
    borderRadius: "14px",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    textAlign: "center",
  },

  errorIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  empty: {
    margin: "0 25px 25px",
    padding: "40px 25px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },
};