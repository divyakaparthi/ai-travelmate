import { Router, Request, Response } from "express";
import db from "../prisma/db";

const router = Router();

/**
 * GET /api/hotels
 *
 * Examples:
 *
 * /api/hotels
 * /api/hotels?destination=Mumbai
 * /api/hotels?destination=Mumbai&type=hotel
 * /api/hotels?destination=Mumbai&type=hostel
 */
router.get(
  "/",
  async (req: Request, res: Response) => {
    try {
      const destination =
        typeof req.query.destination === "string"
          ? req.query.destination.trim()
          : "";

      const type =
        typeof req.query.type === "string"
          ? req.query.type.trim().toLowerCase()
          : "";

      const allHotels =
        await db.orm.public.Hotel.all();

      let filteredHotels = allHotels;

      // --------------------------------------------------
      // Destination filter
      // --------------------------------------------------

      if (destination) {
        filteredHotels = filteredHotels.filter(
          (hotel) =>
            hotel.destination
              .toLowerCase() ===
            destination.toLowerCase()
        );
      }

      // --------------------------------------------------
      // Hostel / hotel filter
      // --------------------------------------------------

      if (type === "hostel") {
        filteredHotels =
          filteredHotels.filter((hotel) =>
            hotel.category
              .toLowerCase()
              .includes("hostel")
          );
      }

      if (type === "hotel") {
        filteredHotels =
          filteredHotels.filter(
            (hotel) =>
              !hotel.category
                .toLowerCase()
                .includes("hostel")
          );
      }

      return res.status(200).json({
        success: true,
        count: filteredHotels.length,
        destination: destination || undefined,
        type: type || "all",
        hotels: filteredHotels,
      });
    } catch (error) {
      console.error(
        "❌ Error fetching hotels/hostels:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch hotels and hostels",
      });
    }
  }
);

export default router;