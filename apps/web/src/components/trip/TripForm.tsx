import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { createTrip } from "../../api";

import "./TripForm.css";

export default function TripForm() {
  const navigate = useNavigate();

  // ============================================================
  // FORM STATE
  // ============================================================

  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [budget, setBudget] = useState("6000");
  const [travelers, setTravelers] = useState("1");

  const [preferences, setPreferences] = useState("");

  // ============================================================
  // UI STATE
  // ============================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    // ----------------------------------------------------------
    // Starting location
    // ----------------------------------------------------------

    if (!startLocation.trim()) {
      setError(
        "Please enter your starting location."
      );
      return;
    }

    // ----------------------------------------------------------
    // Destination
    // ----------------------------------------------------------

    if (!destination.trim()) {
      setError(
        "Please enter your destination."
      );
      return;
    }

    // ----------------------------------------------------------
    // Start date
    // ----------------------------------------------------------

    if (!startDate) {
      setError(
        "Please select a start date."
      );
      return;
    }

    // ----------------------------------------------------------
    // End date
    // ----------------------------------------------------------

    if (!endDate) {
      setError(
        "Please select an end date."
      );
      return;
    }

    // ----------------------------------------------------------
    // Date validation
    // ----------------------------------------------------------

    if (
      new Date(endDate) <
      new Date(startDate)
    ) {
      setError(
        "End date cannot be before start date."
      );
      return;
    }

    // ----------------------------------------------------------
    // Budget validation
    // ----------------------------------------------------------

    const budgetNumber = Number(budget);

    if (
      !Number.isFinite(budgetNumber) ||
      budgetNumber <= 0
    ) {
      setError(
        "Please enter a valid budget."
      );
      return;
    }

    // ----------------------------------------------------------
    // Travelers validation
    // ----------------------------------------------------------

    const travelersNumber =
      Number(travelers);

    if (
      !Number.isFinite(travelersNumber) ||
      travelersNumber <= 0
    ) {
      setError(
        "Please enter a valid number of travelers."
      );
      return;
    }

    // ----------------------------------------------------------
    // Submit
    // ----------------------------------------------------------

    try {
      setLoading(true);

      const response = await createTrip({
        startLocation:
          startLocation.trim(),

        destination:
          destination.trim(),

        startDate,

        endDate,

        budget:
          budgetNumber,

        travelers:
          travelersNumber,

        preferences:
          preferences.trim(),
      });

      // --------------------------------------------------------
      // Debug information
      // --------------------------------------------------------

      console.log(
        "CREATE TRIP RESPONSE:",
        response
      );

      console.log(
        "CREATED TRIP:",
        response.trip
      );

      console.log(
        "CREATED TRIP ID:",
        response.trip?.id
      );

      console.log(
        "START LOCATION:",
        response.trip?.startLocation
      );

      console.log(
        "DESTINATION:",
        response.trip?.destination
      );

      // --------------------------------------------------------
      // Make sure trip ID exists
      // --------------------------------------------------------

      if (!response.trip?.id) {
        throw new Error(
          "Trip was created but no trip ID was returned."
        );
      }

      // --------------------------------------------------------
      // Navigate to trip details
      // --------------------------------------------------------

      navigate(
        `/trips/${response.trip.id}`
      );
    } catch (err) {
      console.error(
        "Failed to create trip:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your trip."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <section className="trip-form-section">
      <div className="trip-form-container">

        {/* =====================================================
            HEADING
        ====================================================== */}

        <div className="trip-form-heading">
          <span className="trip-form-eyebrow">
            START YOUR JOURNEY
          </span>

          <h1>
            Where do you want to go?
          </h1>

          <p>
            Tell us a little about your trip and
            we'll help you plan the rest.
          </p>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          className="trip-form-card"
          onSubmit={handleSubmit}
        >

          {/* ===================================================
              STARTING LOCATION
          ==================================================== */}

          <div className="form-group form-group-full">
            <label htmlFor="startLocation">
              <span className="label-icon">
                🚩
              </span>

              Starting location
            </label>

            <input
              id="startLocation"
              type="text"
              value={startLocation}
              onChange={(event) =>
                setStartLocation(
                  event.target.value
                )
              }
              placeholder="e.g. Bangalore"
              disabled={loading}
              autoComplete="address-level2"
            />

            <small>
              Where will your journey start?
            </small>
          </div>

          {/* ===================================================
              DESTINATION
          ==================================================== */}

          <div className="form-group form-group-full">
            <label htmlFor="destination">
              <span className="label-icon">
                📍
              </span>

              Destination
            </label>

            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value
                )
              }
              placeholder="e.g. Hyderabad"
              disabled={loading}
              autoComplete="address-level2"
            />
          </div>

          {/* ===================================================
              DATES
          ==================================================== */}

          <div className="form-row">

            {/* START DATE */}

            <div className="form-group">
              <label htmlFor="startDate">
                <span className="label-icon">
                  📅
                </span>

                Start date
              </label>

              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(
                    event.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* END DATE */}

            <div className="form-group">
              <label htmlFor="endDate">
                <span className="label-icon">
                  📅
                </span>

                End date
              </label>

              <input
                id="endDate"
                type="date"
                value={endDate}
                min={
                  startDate ||
                  undefined
                }
                onChange={(event) =>
                  setEndDate(
                    event.target.value
                  )
                }
                disabled={loading}
              />
            </div>

          </div>

          {/* ===================================================
              BUDGET + TRAVELERS
          ==================================================== */}

          <div className="form-row">

            {/* BUDGET */}

            <div className="form-group">
              <label htmlFor="budget">
                <span className="label-icon">
                  💰
                </span>

                Budget
              </label>

              <div className="currency-input">
                <span>₹</span>

                <input
                  id="budget"
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(event) =>
                    setBudget(
                      event.target.value
                    )
                  }
                  placeholder="6000"
                  disabled={loading}
                />
              </div>

              <small>
                Your approximate total trip
                budget
              </small>
            </div>

            {/* TRAVELERS */}

            <div className="form-group">
              <label htmlFor="travelers">
                <span className="label-icon">
                  👥
                </span>

                Travelers
              </label>

              <input
                id="travelers"
                type="number"
                min="1"
                max="50"
                value={travelers}
                onChange={(event) =>
                  setTravelers(
                    event.target.value
                  )
                }
                placeholder="1"
                disabled={loading}
              />

              <small>
                Number of people traveling
              </small>
            </div>

          </div>

          {/* ===================================================
              PREFERENCES
          ==================================================== */}

          <div className="form-group form-group-full">
            <label htmlFor="preferences">
              <span className="label-icon">
                ❤️
              </span>

              What are you interested in?
            </label>

            <textarea
              id="preferences"
              value={preferences}
              onChange={(event) =>
                setPreferences(
                  event.target.value
                )
              }
              placeholder="e.g. beaches, food, shopping, temples, mountains, adventure..."
              rows={4}
              disabled={loading}
            />

            <small>
              Tell us what you enjoy so we can
              personalize your itinerary.
            </small>
          </div>

          {/* ===================================================
              ERROR
          ==================================================== */}

          {error && (
            <div
              className="trip-form-error"
              role="alert"
            >
              ⚠️ {error}
            </div>
          )}

          {/* ===================================================
              SUBMIT BUTTON
          ==================================================== */}

          <button
            type="submit"
            className="create-trip-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner" />

                Creating your trip...
              </>
            ) : (
              <>
                ✨ Create my trip
              </>
            )}
          </button>

        </form>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="trip-form-footer">
          <span>🤖</span>

          <p>
            AI TravelMate will create a
            personalized itinerary based on
            your choices.
          </p>
        </div>

      </div>
    </section>
  );
}


