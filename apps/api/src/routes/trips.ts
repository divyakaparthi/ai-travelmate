import { Router } from "express";
import { Temporal } from "@js-temporal/polyfill";

import db from "../prisma/db";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "../middleware/auth";

const router = Router();

/*
|--------------------------------------------------------------------------
| All routes below require login
|--------------------------------------------------------------------------
*/

router.use(authenticateToken);

/*
|--------------------------------------------------------------------------
| GET /api/trips/test
|--------------------------------------------------------------------------
| Test protected trip route.
|--------------------------------------------------------------------------
*/

router.get("/test", (req: AuthenticatedRequest, res) => {
  return res.json({
    success: true,
    message: "Trip route is working!",
    userId: req.user?.userId,
  });
});

/*
|--------------------------------------------------------------------------
| GET /api/trips
|--------------------------------------------------------------------------
| Return ONLY trips belonging to the logged-in user.
|--------------------------------------------------------------------------
*/

router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    const trips = await db.orm.public.Trip.all();

    const userTrips = trips.filter(
      (trip) => trip.userId === userId
    );

    console.log(
      `Found ${userTrips.length} trips for user:`,
      userId
    );

    return res.json(userTrips);
  } catch (error) {
    console.error("Error fetching trips:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch trips.",
      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/trips/:id
|--------------------------------------------------------------------------
| Return one trip only if it belongs to the logged-in user.
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required.",
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Trip ID is required.",
        });
      }

      const trips = await db.orm.public.Trip.all();

      const trip = trips.find(
        (item) =>
          item.id === id &&
          item.userId === userId
      );

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: "Trip not found.",
        });
      }

      console.log(
        "Found trip:",
        trip.id,
        "for user:",
        userId
      );

      return res.json(trip);
    } catch (error) {
      console.error("Error fetching trip:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to fetch trip.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| POST /api/trips
|--------------------------------------------------------------------------
| Create a trip for the currently logged-in user.
|
| Required:
|   destination
|   startLocation
|   startDate
|   endDate
|   budget
|
| Optional:
|   travelers
|   preferences
|   interests
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Read request body
      |--------------------------------------------------------------------------
      */

      const {
        destination,
        startLocation,
        startDate,
        endDate,
        budget,
        travelers,
        preferences,
        interests,
      } = req.body;

      console.log(
        "Create trip request:",
        req.body
      );

      console.log(
        "Creating trip for user:",
        userId
      );

      /*
      |--------------------------------------------------------------------------
      | Validate required fields
      |--------------------------------------------------------------------------
      */

      if (
        !destination ||
        !startLocation ||
        !startDate ||
        !endDate ||
        budget === undefined ||
        budget === null
      ) {
        return res.status(400).json({
          success: false,
          error:
            "destination, startLocation, startDate, endDate and budget are required.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Validate string fields
      |--------------------------------------------------------------------------
      */

      if (
        typeof destination !== "string" ||
        typeof startLocation !== "string" ||
        typeof startDate !== "string" ||
        typeof endDate !== "string"
      ) {
        return res.status(400).json({
          success: false,
          error:
            "destination, startLocation, startDate and endDate must be strings.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Validate empty strings
      |--------------------------------------------------------------------------
      */

      if (!destination.trim()) {
        return res.status(400).json({
          success: false,
          error: "Destination cannot be empty.",
        });
      }

      if (!startLocation.trim()) {
        return res.status(400).json({
          success: false,
          error: "Starting location cannot be empty.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Validate budget
      |--------------------------------------------------------------------------
      */

      const numericBudget = Number(budget);

      if (
        !Number.isFinite(numericBudget) ||
        numericBudget <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Budget must be a valid positive number.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Validate travelers
      |--------------------------------------------------------------------------
      |
      | travelers is currently collected by the frontend,
      | but your current Trip database model does not contain
      | a travelers column.
      |
      | Therefore we validate it here but do not store it.
      |--------------------------------------------------------------------------
      */

      if (travelers !== undefined && travelers !== null) {
        const numericTravelers = Number(travelers);

        if (
          !Number.isInteger(numericTravelers) ||
          numericTravelers <= 0
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Travelers must be a valid positive whole number.",
          });
        }
      }

      /*
      |--------------------------------------------------------------------------
      | Validate dates
      |--------------------------------------------------------------------------
      */

      const startDateObject = new Date(
        `${startDate}T00:00:00Z`
      );

      const endDateObject = new Date(
        `${endDate}T00:00:00Z`
      );

      if (
        Number.isNaN(
          startDateObject.getTime()
        ) ||
        Number.isNaN(
          endDateObject.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid startDate or endDate.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | End date cannot be before start date
      |--------------------------------------------------------------------------
      */

      if (
        endDateObject.getTime() <
        startDateObject.getTime()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "End date cannot be before start date.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Calculate trip duration
      |--------------------------------------------------------------------------
      */

      const difference =
        endDateObject.getTime() -
        startDateObject.getTime();

      const numberOfDays =
        Math.floor(
          difference /
            (1000 * 60 * 60 * 24)
        ) + 1;

      /*
      |--------------------------------------------------------------------------
      | Limit trip duration
      |--------------------------------------------------------------------------
      */

      if (
        numberOfDays < 1 ||
        numberOfDays > 30
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Trip duration must be between 1 and 30 days.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Preferences / interests compatibility
      |--------------------------------------------------------------------------
      |
      | Current frontend sends:
      |   preferences
      |
      | Older components may send:
      |   interests
      |
      | Database currently contains:
      |   interests
      |
      | So we support both.
      |--------------------------------------------------------------------------
      */

      let finalInterests: string | null = null;

      if (
        typeof preferences === "string" &&
        preferences.trim()
      ) {
        finalInterests =
          preferences.trim();
      } else if (
        typeof interests === "string" &&
        interests.trim()
      ) {
        finalInterests =
          interests.trim();
      }

      /*
      |--------------------------------------------------------------------------
      | Create trip
      |--------------------------------------------------------------------------
      */

      const trip =
        await db.orm.public.Trip.create({
          userId,

          destination:
            destination.trim(),

          startLocation:
            startLocation.trim(),

          startDate:
            Temporal.Instant.from(
              `${startDate}T00:00:00Z`
            ),

          endDate:
            Temporal.Instant.from(
              `${endDate}T00:00:00Z`
            ),

          budget:
            Math.round(numericBudget),

          interests:
            finalInterests,
        });

      /*
      |--------------------------------------------------------------------------
      | Log created trip
      |--------------------------------------------------------------------------
      */

      console.log(
        "Created trip:",
        trip
      );

      /*
      |--------------------------------------------------------------------------
      | Success response
      |--------------------------------------------------------------------------
      */

      return res.status(201).json({
        success: true,

        message:
          "Trip created successfully.",

        trip,

        numberOfDays,

        travelers:
          travelers !== undefined &&
          travelers !== null
            ? Number(travelers)
            : 1,
      });
    } catch (error) {
      console.error(
        "Error creating trip:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to create trip.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

export default router;