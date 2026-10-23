import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getTrip,
  generateItinerary,
  type Trip,
  type Itinerary,
} from "../api";

import ThemeToggle from "../components/common/ThemeToggle";
import Chatbot from "../components/chatbot/Chatbot";
import PhotoRecognition from "../components/photo-recognition/PhotoRecognition";
import RecommendedPlaces from "../components/places/RecommendedPlaces";
import HotelsRestaurants from "../components/hotels-restaurants/HotelsRestaurants";
import TravelMap from "../components/map/TravelMap";

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD TRIP
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function loadTrip() {
      if (!id || id === "undefined" || id === "null") {
        setError("Trip ID is missing or invalid.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("REQUESTING TRIP:", id);

        const data = await getTrip(id);

        console.log("TRIP RESPONSE:", data);

        if (cancelled) {
          return;
        }

        setTrip(data);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load trip:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load trip."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTrip();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ============================================================
  // GENERATE AI ITINERARY
  // ============================================================

  async function handleGenerateItinerary() {
    if (!trip) {
      setError("Trip information is not available.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      console.log("GENERATING ITINERARY FOR:", trip);

      /*
       * IMPORTANT
       *
       * Do NOT pass tripId here.
       *
       * Current api.ts generateItinerary() expects the
       * itinerary input object containing these fields.
       */
      const generated = await generateItinerary({
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        preferences: trip.preferences ?? "",
      });

      console.log("GENERATED ITINERARY:", generated);

      setItinerary(generated);

      setSuccess(
        "Your personalized AI itinerary has been generated successfully!"
      );
    } catch (err) {
      console.error("Generate itinerary error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate itinerary."
      );
    } finally {
      setGenerating(false);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.centerCard}>
          <div style={styles.bigIcon}>✈️</div>

          <h2 style={styles.centerTitle}>
            Loading your trip...
          </h2>

          <p style={styles.mutedText}>
            Please wait while we load your travel details.
          </p>
        </div>
      </main>
    );
  }

  // ============================================================
  // TRIP NOT FOUND
  // ============================================================

  if (!trip) {
    return (
      <main style={styles.page}>
        <div style={styles.centerCard}>
          <div style={styles.bigIcon}>⚠️</div>

          <h2 style={styles.centerTitle}>
            Trip not found
          </h2>

          <p style={styles.errorText}>
            {error || "We could not find this trip."}
          </p>

          <Link
            to="/home"
            style={styles.primaryButton}
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* ======================================================
            TOP BAR
        ====================================================== */}

        <div style={styles.topBar}>
          <Link
            to="/home"
            style={styles.backLink}
          >
            ← Back to Home
          </Link>

          <ThemeToggle />
        </div>

        {/* ======================================================
            TRIP HEADER
        ====================================================== */}

        <section style={styles.headerCard}>
          <div>
            <p style={styles.label}>
              YOUR JOURNEY
            </p>

            <h1 style={styles.title}>
              ✈️ {trip.destination}
            </h1>

            <p style={styles.dateText}>
              📅{" "}
              {formatDate(trip.startDate)}
              {" → "}
              {formatDate(trip.endDate)}
            </p>
          </div>

          <div style={styles.budgetBox}>
            <span style={styles.budgetLabel}>
              TOTAL BUDGET
            </span>

            <strong style={styles.budget}>
              ₹{Number(trip.budget).toLocaleString("en-IN")}
            </strong>
          </div>
        </section>

        {/* ======================================================
            TRIP INFORMATION
        ====================================================== */}

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.smallLabel}>
                TRIP DETAILS
              </p>

              <h2 style={styles.sectionTitle}>
                Your travel plan
              </h2>
            </div>

            <span style={styles.infoEmoji}>
              🧳
            </span>
          </div>

          <div style={styles.infoGrid}>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                📍 Destination
              </span>

              <strong style={styles.infoValue}>
                {trip.destination}
              </strong>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                📅 Start Date
              </span>

              <strong style={styles.infoValue}>
                {formatDate(trip.startDate)}
              </strong>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                📅 End Date
              </span>

              <strong style={styles.infoValue}>
                {formatDate(trip.endDate)}
              </strong>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                💰 Budget
              </span>

              <strong style={styles.infoValue}>
                ₹{Number(trip.budget).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

          <div style={styles.interestsBox}>
            <span style={styles.infoLabel}>
              ❤️ Your preferences
            </span>

            <p style={styles.interestsText}>
              {trip.preferences ||
                "No specific interests were selected."}
            </p>
          </div>
        </section>

        {/* ======================================================
            HOTELS & RESTAURANTS
        ====================================================== */}

        <section style={styles.featureSection}>
          <HotelsRestaurants
            destination={trip.destination}
          />
        </section>

        {/* ======================================================
            TRAVEL MAP
        ====================================================== */}

        <section style={styles.featureSection}>
          <TravelMap
            destination={trip.destination}
          />
        </section>

        {/* ======================================================
            PHOTO RECOGNITION
        ====================================================== */}

        <section style={styles.featureSection}>
          <PhotoRecognition
            destination={trip.destination}
          />
        </section>

        {/* ======================================================
            RECOMMENDED PLACES
        ====================================================== */}

        <section style={styles.featureSection}>
          <RecommendedPlaces
            destination={trip.destination}
          />
        </section>

        {/* ======================================================
            SUCCESS MESSAGE
        ====================================================== */}

        {success && (
          <div style={styles.successBox}>
            <span>✅</span>

            <div>
              <strong>Itinerary ready!</strong>

              <p>{success}</p>
            </div>
          </div>
        )}

        {/* ======================================================
            ERROR MESSAGE
        ====================================================== */}

        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span>

            <div>
              <strong>Something went wrong</strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ======================================================
            GENERATE ITINERARY
        ====================================================== */}

        {!itinerary && (
          <section style={styles.generateCard}>

            <div style={styles.aiCircle}>
              🤖
            </div>

            <p style={styles.smallLabel}>
              AI TRAVEL PLANNER
            </p>

            <h2 style={styles.generateTitle}>
              Create your personalized itinerary
            </h2>

            <p style={styles.generateDescription}>
              Let AI build a personalized day-by-day
              travel plan based on your destination,
              travel dates, budget and interests.
            </p>

            <button
              type="button"
              onClick={handleGenerateItinerary}
              disabled={generating}
              style={{
                ...styles.generateButton,
                opacity: generating ? 0.7 : 1,
                cursor: generating
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {generating
                ? "🤖 Creating your itinerary..."
                : "✨ Generate AI Itinerary"}
            </button>

          </section>
        )}

        {/* ======================================================
            GENERATED ITINERARY
        ====================================================== */}

        {itinerary && (
          <>
            <section style={styles.itineraryHeader}>

              <div style={styles.aiBadge}>
                🤖 AI GENERATED
              </div>

              <h2 style={styles.itineraryTitle}>
                🗺️ Your {itinerary.destination} Itinerary
              </h2>

              <p style={styles.generateDescription}>
                Your personalized travel plan is ready.
              </p>

            </section>

            {/* ==================================================
                DAYS
            ================================================== */}

            {itinerary.days.map((day, index) => (
              <section
                key={`${day.day}-${index}`}
                style={styles.dayCard}
              >

                {/* DAY HEADER */}

                <div style={styles.dayHeader}>

                  <div>
                    <span style={styles.dayBadge}>
                      DAY {day.day}
                    </span>

                    <h3 style={styles.dayTitle}>
                      {formatDateLong(day.date)}
                    </h3>
                  </div>

                  <div style={styles.dayCost}>
                    ₹
                    {Number(
                      day.estimatedCost ?? 0
                    ).toLocaleString("en-IN")}
                  </div>

                </div>

                {/* DAILY SCHEDULE */}

                <div style={styles.scheduleGrid}>

                  <div style={styles.scheduleCard}>
                    <span style={styles.scheduleIcon}>
                      🌅
                    </span>

                    <h4>Morning</h4>

                    <p>
                      {day.morning ||
                        "No morning activity available."}
                    </p>
                  </div>

                  <div style={styles.scheduleCard}>
                    <span style={styles.scheduleIcon}>
                      ☀️
                    </span>

                    <h4>Afternoon</h4>

                    <p>
                      {day.afternoon ||
                        "No afternoon activity available."}
                    </p>
                  </div>

                  <div style={styles.scheduleCard}>
                    <span style={styles.scheduleIcon}>
                      🌆
                    </span>

                    <h4>Evening</h4>

                    <p>
                      {day.evening ||
                        "No evening activity available."}
                    </p>
                  </div>

                </div>

                {/* ==================================================
                    PLACES
                ================================================== */}

                <div style={styles.subSection}>
                  <h4 style={styles.subTitle}>
                    📍 Places to Visit
                  </h4>

                  {day.places &&
                  day.places.length > 0 ? (
                    <div style={styles.tags}>
                      {day.places.map(
                        (place, placeIndex) => (
                          <span
                            key={`${place}-${placeIndex}`}
                            style={styles.tag}
                          >
                            {place}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p style={styles.mutedText}>
                      No places were listed for this day.
                    </p>
                  )}
                </div>

                {/* ==================================================
                    FOOD
                ================================================== */}

                <div style={styles.foodBox}>
                  <strong>
                    🍴 Food Recommendation
                  </strong>

                  <p>
                    {day.food ||
                      "No food recommendation available."}
                  </p>
                </div>

              </section>
            ))}

            {/* ==================================================
                PACKING CHECKLIST
            ================================================== */}

            <section style={styles.card}>

              <div style={styles.sectionHeader}>
                <div>
                  <p style={styles.smallLabel}>
                    PREPARE
                  </p>

                  <h2 style={styles.sectionTitle}>
                    🎒 Packing Checklist
                  </h2>
                </div>
              </div>

              {itinerary.packingChecklist &&
              itinerary.packingChecklist.length > 0 ? (
                <div style={styles.checklist}>
                  {itinerary.packingChecklist.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                        style={styles.checkItem}
                      >
                        <span style={styles.checkbox}>
                          ☐
                        </span>

                        <span>{item}</span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p style={styles.mutedText}>
                  No packing items were generated.
                </p>
              )}

            </section>

            {/* ==================================================
                EXPENSES
            ================================================== */}

            {itinerary.estimatedExpenses && (
              <section style={styles.card}>

                <div style={styles.sectionHeader}>
                  <div>
                    <p style={styles.smallLabel}>
                      BUDGET
                    </p>

                    <h2 style={styles.sectionTitle}>
                      💰 Estimated Expenses
                    </h2>
                  </div>
                </div>

                <div style={styles.expenseList}>

                  <div style={styles.expenseRow}>
                    <span>🚗 Transport</span>

                    <strong>
                      ₹
                      {Number(
                        itinerary.estimatedExpenses.transport ?? 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div style={styles.expenseRow}>
                    <span>🍴 Food</span>

                    <strong>
                      ₹
                      {Number(
                        itinerary.estimatedExpenses.food ?? 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div style={styles.expenseRow}>
                    <span>🎟️ Activities</span>

                    <strong>
                      ₹
                      {Number(
                        itinerary.estimatedExpenses.activities ?? 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div style={styles.expenseRow}>
                    <span>🏨 Accommodation</span>

                    <strong>
                      ₹
                      {Number(
                        itinerary.estimatedExpenses.accommodation ?? 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div style={styles.totalRow}>
                    <span>Total Estimated Cost</span>

                    <strong>
                      ₹
                      {Number(
                        itinerary.estimatedExpenses.total ?? 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                </div>
              </section>
            )}

            {/* ==================================================
                GENERATE AGAIN
            ================================================== */}

            <button
              type="button"
              onClick={handleGenerateItinerary}
              disabled={generating}
              style={{
                ...styles.regenerateButton,
                opacity: generating ? 0.7 : 1,
                cursor: generating
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {generating
                ? "🤖 Generating..."
                : "🔄 Generate Again"}
            </button>
          </>
        )}

        {/* ======================================================
            CHATBOT
        ====================================================== */}

        <section style={styles.chatbotSection}>

          <div style={styles.chatbotHeader}>
            <p style={styles.smallLabel}>
              AI TRAVEL ASSISTANT
            </p>

            <h2 style={styles.chatbotTitle}>
              🤖 Ask AI TravelMate
            </h2>

            <p style={styles.chatbotDescription}>
              Ask about your destination, places,
              food, transportation, budget or itinerary.
            </p>
          </div>

          <Chatbot trip={trip} />

        </section>

      </div>
    </main>
  );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatDate(value: string | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN");
}

function formatDateLong(value: string | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "30px 20px 70px",
    background:
      "linear-gradient(180deg, #f5f7ff 0%, #eef2ff 100%)",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 16px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    textDecoration: "none",
    fontWeight: 700,
    boxShadow:
      "0 4px 16px rgba(15, 23, 42, 0.06)",
  },

  headerCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    padding: "35px",
    marginBottom: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow:
      "0 12px 35px rgba(15, 23, 42, 0.08)",
  },

  label: {
    margin: "0 0 8px",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "2px",
  },

  title: {
    margin: 0,
    color: "#111827",
    fontSize: "42px",
    lineHeight: 1.1,
  },

  dateText: {
    margin: "14px 0 0",
    color: "#64748b",
    fontSize: "16px",
    fontWeight: 600,
  },

  budgetBox: {
    minWidth: "180px",
    padding: "20px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    textAlign: "center",
  },

  budgetLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    opacity: 0.85,
  },

  budget: {
    display: "block",
    marginTop: "7px",
    fontSize: "27px",
  },

  card: {
    marginBottom: "24px",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  smallLabel: {
    margin: "0 0 6px",
    color: "#6366f1",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
  },

  sectionTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "25px",
  },

  infoEmoji: {
    fontSize: "35px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  infoItem: {
    padding: "18px",
    borderRadius: "15px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
  },

  infoLabel: {
    display: "block",
    marginBottom: "8px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 700,
  },

  infoValue: {
    color: "#111827",
    fontSize: "16px",
  },

  interestsBox: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "15px",
    backgroundColor: "#f5f3ff",
  },

  interestsText: {
    margin: 0,
    color: "#4b5563",
    lineHeight: 1.6,
  },

  featureSection: {
    marginBottom: "24px",
  },

  successBox: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "20px",
    padding: "17px 20px",
    borderRadius: "14px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
  },

  errorBox: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "20px",
    padding: "17px 20px",
    borderRadius: "14px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
  },

  generateCard: {
    marginBottom: "30px",
    padding: "55px 35px",
    borderRadius: "25px",
    background:
      "linear-gradient(135deg, #eef2ff, #faf5ff)",
    border: "1px solid #ddd6fe",
    textAlign: "center",
  },

  aiCircle: {
    width: "70px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    fontSize: "35px",
    boxShadow:
      "0 8px 25px rgba(79, 70, 229, 0.15)",
  },

  generateTitle: {
    margin: "8px 0 14px",
    color: "#111827",
    fontSize: "30px",
  },

  generateDescription: {
    maxWidth: "680px",
    margin: "0 auto 25px",
    color: "#64748b",
    lineHeight: 1.7,
    fontSize: "16px",
  },

  generateButton: {
    border: "none",
    borderRadius: "12px",
    padding: "14px 25px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 800,
    boxShadow:
      "0 8px 20px rgba(79, 70, 229, 0.25)",
  },

  itineraryHeader: {
    marginBottom: "24px",
    padding: "30px",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  aiBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1px",
  },

  itineraryTitle: {
    margin: "14px 0 10px",
    color: "#111827",
    fontSize: "30px",
  },

  dayCard: {
    marginBottom: "22px",
    padding: "28px",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  dayHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "22px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
  },

  dayBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "8px",
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1px",
  },

  dayTitle: {
    margin: "9px 0 0",
    color: "#111827",
    fontSize: "20px",
  },

  dayCost: {
    padding: "10px 15px",
    borderRadius: "10px",
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    fontWeight: 800,
  },

  scheduleGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  scheduleCard: {
    padding: "20px",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
  },

  scheduleIcon: {
    fontSize: "25px",
  },

  subSection: {
    marginTop: "24px",
  },

  subTitle: {
    margin: "0 0 12px",
    color: "#1f2937",
    fontSize: "17px",
  },

  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  tag: {
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    fontSize: "13px",
    fontWeight: 700,
  },

  foodBox: {
    marginTop: "22px",
    padding: "17px",
    borderRadius: "14px",
    backgroundColor: "#fff7ed",
    color: "#9a3412",
  },

  checklist: {
    display: "grid",
    gap: "10px",
  },

  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 15px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    color: "#374151",
  },

  checkbox: {
    fontSize: "20px",
    color: "#4f46e5",
  },

  expenseList: {
    display: "grid",
    gap: "5px",
  },

  expenseRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb",
    color: "#475569",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    padding: "18px 0 0",
    color: "#111827",
    fontSize: "18px",
    fontWeight: 800,
  },

  regenerateButton: {
    display: "block",
    width: "100%",
    marginBottom: "35px",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#111827",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 800,
  },

  chatbotSection: {
    marginTop: "35px",
    padding: "30px",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  chatbotHeader: {
    marginBottom: "22px",
  },

  chatbotTitle: {
    margin: "5px 0 8px",
    color: "#111827",
    fontSize: "26px",
  },

  chatbotDescription: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },

  centerCard: {
    maxWidth: "500px",
    margin: "120px auto",
    padding: "45px",
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(15, 23, 42, 0.1)",
  },

  bigIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  centerTitle: {
    margin: "10px 0",
    color: "#111827",
    fontSize: "28px",
  },

  mutedText: {
    color: "#64748b",
    lineHeight: 1.6,
  },

  errorText: {
    marginBottom: "25px",
    color: "#dc2626",
    lineHeight: 1.6,
  },

  primaryButton: {
    display: "inline-block",
    padding: "13px 20px",
    borderRadius: "10px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 800,
  },
};