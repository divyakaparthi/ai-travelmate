import "dotenv/config";

import app from "./app.js";
import db from "./prisma/db.js";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await db.connect();

    console.log("PostgreSQL connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`AI TravelMate API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start AI TravelMate API:", error);
    process.exit(1);
  }
}

void startServer();
