import { Router } from "express";
import db from "../prisma/db";

const router = Router();

/*
|--------------------------------------------------------------------------
| GET /api/places
|--------------------------------------------------------------------------
| Get all places.
|
| Optional destination filter:
|
| /api/places?destination=Mumbai
| /api/places?destination=Delhi
| /api/places?destination=Goa
|
| This endpoint is PUBLIC.
| No login token is required.
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const destination =
      typeof req.query.destination === "string"
        ? req.query.destination.trim()
        : "";

    console.log(
      "=========================================="
    );

    console.log(
      "📍 Places request received."
    );

    console.log(
      "Destination:",
      destination || "All destinations"
    );

    /*
    |--------------------------------------------------------------------------
    | Get places from PostgreSQL
    |--------------------------------------------------------------------------
    */

    const places =
      await db.orm.public.Place.all();

    console.log(
      `📊 Total places in database: ${places.length}`
    );

    /*
    |--------------------------------------------------------------------------
    | Filter by destination
    |--------------------------------------------------------------------------
    */

    const filteredPlaces = destination
      ? places.filter((place) => {
          const placeDestination =
            typeof place.destination === "string"
              ? place.destination
              : "";

          return placeDestination
            .toLowerCase()
            .includes(
              destination.toLowerCase()
            );
        })
      : places;

    console.log(
      `✅ Places returned: ${filteredPlaces.length}`
    );

    console.log(
      "=========================================="
    );

    /*
    |--------------------------------------------------------------------------
    | Success response
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      places: filteredPlaces,
    });
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error(
      "❌ Error fetching places:"
    );

    console.error(error);

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch places.",
      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/places/:id
|--------------------------------------------------------------------------
| Get one specific place.
|
| Example:
|
| /api/places/123
|
| This endpoint is also PUBLIC.
|--------------------------------------------------------------------------
*/

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(
      "=========================================="
    );

    console.log(
      "📍 Place details request:"
    );

    console.log("Place ID:", id);

    /*
    |--------------------------------------------------------------------------
    | Validate ID
    |--------------------------------------------------------------------------
    */

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Place ID is required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get places
    |--------------------------------------------------------------------------
    */

    const places =
      await db.orm.public.Place.all();

    /*
    |--------------------------------------------------------------------------
    | Find requested place
    |--------------------------------------------------------------------------
    */

    const place = places.find(
      (item) => item.id === id
    );

    /*
    |--------------------------------------------------------------------------
    | Place not found
    |--------------------------------------------------------------------------
    */

    if (!place) {
      console.log(
        "❌ Place not found:",
        id
      );

      console.log(
        "=========================================="
      );

      return res.status(404).json({
        success: false,
        message:
          "Place not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    console.log(
      "✅ Found place:",
      place.id
    );

    console.log(
      "=========================================="
    );

    return res.status(200).json({
      success: true,
      place,
    });
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error(
      "❌ Error fetching place:"
    );

    console.error(error);

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch place.",
      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});

/*
|--------------------------------------------------------------------------
| Export router
|--------------------------------------------------------------------------
*/

export default router;