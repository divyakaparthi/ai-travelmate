
import { Router, Request, Response } from "express";
import db from "../prisma/db";

const router = Router();

/**
 * GET /api/restaurants
 *
 * Get all restaurants:
 * /api/restaurants
 *
 * Get restaurants for a destination:
 * /api/restaurants?destination=Goa
 *
 * Examples:
 * /api/restaurants?destination=Mumbai
 * /api/restaurants?destination=Delhi
 * /api/restaurants?destination=Hyderabad
 * /api/restaurants?destination=Jaipur
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const destination =
      typeof req.query.destination === "string"
        ? req.query.destination.trim()
        : "";

    // Get all restaurants
    if (!destination) {
      const restaurants =
        await db.orm.public.Restaurant.all();

      return res.status(200).json({
        success: true,
        count: restaurants.length,
        restaurants,
      });
    }

    // Get all restaurants and filter by destination
    const allRestaurants =
      await db.orm.public.Restaurant.all();

    const restaurants = allRestaurants.filter(
      (restaurant) =>
        restaurant.destination.toLowerCase() ===
        destination.toLowerCase()
    );

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      destination,
      restaurants,
    });
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
    });
  }
});

export default router;

