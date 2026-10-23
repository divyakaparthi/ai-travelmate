import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import authRoutes from "./routes/auth";
import tripRoutes from "./routes/trips";
import itineraryRoutes from "./routes/itinerary";
import aiRoutes from "./routes/ai";
import chatRoutes from "./routes/chat";
import photoRecognitionRouter from "./routes/photoRecognition.js";
import placesRoutes from "./routes/places.js";
import hotelsRouter from "./routes/hotels";
import restaurantsRouter from "./routes/restaurants";

const app = express();

// =====================================================
// Middleware
// =====================================================

app.use(cors());

app.use(helmet());

app.use(
  express.json({
    limit: "20mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

app.use(morgan("dev"));

// =====================================================
// Health Check
// =====================================================

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI TravelMate API",
  });
});

// =====================================================
// API Routes
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api/hotels", hotelsRouter);

app.use("/api/restaurants", restaurantsRouter);

app.use("/api/itinerary", itineraryRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/chat", chatRoutes);

app.use(
  "/api/photo-recognition",
  photoRecognitionRouter
);

app.use("/api/places", placesRoutes);

// =====================================================
// Home
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI TravelMate API is running",
  });
});

// =====================================================
// 404 Handler
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

export default app;