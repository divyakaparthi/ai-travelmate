import { Router } from "express";
import { randomUUID } from "crypto";
import db from "../prisma/db";

const router = Router();

// =====================================================
// Helper: Parse saved itinerary data
// =====================================================

function parseItineraryData(data: unknown): unknown {
  if (typeof data !== "string") {
    return data;
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

// =====================================================
// GET /api/itinerary/:tripId
// Get saved itinerary for a trip
// =====================================================

router.get("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    console.log(
      "Get saved itinerary request:",
      tripId
    );

    if (
      !tripId ||
      tripId === "undefined" ||
      tripId === "null"
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid trip ID is required.",
      });
    }

    // -------------------------------------------------
    // Get itineraries
    // -------------------------------------------------

    const itineraries =
      await db.orm.public.Itinerary.all();

    // -------------------------------------------------
    // Find itinerary for this trip
    // -------------------------------------------------

    const savedItinerary =
      itineraries.find(
        (item) => item.tripId === tripId
      );

    if (!savedItinerary) {
      console.log(
        "No saved itinerary found for:",
        tripId
      );

      return res.status(404).json({
        success: false,
        message: "Itinerary not found.",
      });
    }

    // -------------------------------------------------
    // Parse stored JSON
    // -------------------------------------------------

    const parsedData =
      parseItineraryData(
        savedItinerary.data
      );

    console.log(
      "Saved itinerary found:",
      savedItinerary.id
    );

    return res.status(200).json({
      success: true,

      itinerary: {
        id: savedItinerary.id,
        tripId: savedItinerary.tripId,
        destination:
          savedItinerary.destination,
        data: parsedData,
        createdAt:
          savedItinerary.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching itinerary:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch itinerary.",

      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});

// =====================================================
// POST /api/itinerary
//
// Save generated itinerary.
//
// If itinerary already exists, update it.
// Otherwise create a new record.
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      tripId,
      itinerary,
    } = req.body;

    console.log(
      "=========================================="
    );

    console.log(
      "Save itinerary request"
    );

    console.log(
      "Trip ID:",
      tripId
    );

    // Do not print the entire itinerary
    // because it can be very large.
    console.log(
      "Itinerary received:",
      Boolean(itinerary)
    );

    console.log(
      "=========================================="
    );

    // =================================================
    // Validate trip ID
    // =================================================

    if (
      !tripId ||
      tripId === "undefined" ||
      tripId === "null"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid tripId is required.",
      });
    }

    // =================================================
    // Validate itinerary
    // =================================================

    if (
      !itinerary ||
      typeof itinerary !== "object"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid itinerary is required.",
      });
    }

    // =================================================
    // Find trip
    // =================================================

    const trips =
      await db.orm.public.Trip.all();

    const trip =
      trips.find(
        (item) => item.id === tripId
      );

    if (!trip) {
      console.error(
        "Trip not found:",
        tripId
      );

      return res.status(404).json({
        success: false,
        message:
          "Trip not found.",
      });
    }

    console.log(
      "Trip found:",
      trip.id,
      trip.destination
    );

    // =================================================
    // Get existing itineraries
    // =================================================

    const itineraries =
      await db.orm.public.Itinerary.all();

    const existingItinerary =
      itineraries.find(
        (item) =>
          item.tripId === tripId
      );

    // =================================================
    // UPDATE EXISTING ITINERARY
    // =================================================
if (existingItinerary) {
  let parsedData: unknown;

  try {
    parsedData = JSON.parse(existingItinerary.data);
  } catch {
    parsedData = existingItinerary.data;
  }

  return res.json({
    success: true,
    message: "Itinerary already exists.",
    itinerary: {
      id: existingItinerary.id,
      tripId: existingItinerary.tripId,
      destination: existingItinerary.destination,
      data: parsedData,
      createdAt: existingItinerary.createdAt,
    },
  });
}
    
    // =================================================
    // CREATE NEW ITINERARY
    // =================================================

    const newItinerary =
      await db.orm.public.Itinerary.create({
        id: randomUUID(),

        tripId: trip.id,

        destination:
          trip.destination,

        data:
          JSON.stringify(itinerary),
      });

    console.log(
      "=========================================="
    );

    console.log(
      "Itinerary saved successfully"
    );

    console.log(
      "Itinerary ID:",
      newItinerary.id
    );

    console.log(
      "Trip ID:",
      newItinerary.tripId
    );

    console.log(
      "=========================================="
    );

    // =================================================
    // Return saved itinerary
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        existingItinerary
          ? "Itinerary replaced successfully."
          : "Itinerary saved successfully.",

      itinerary: {
        id: newItinerary.id,

        tripId:
          newItinerary.tripId,

        destination:
          newItinerary.destination,

        data:
          parseItineraryData(
            newItinerary.data
          ),

        createdAt:
          newItinerary.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error(
      "Error saving itinerary:",
      error
    );

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to save itinerary.",

      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});

export default router;