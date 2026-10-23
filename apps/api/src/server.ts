import "dotenv/config";

import app from "./app.js";
import db from "./prisma/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.connect();

    console.log("✅ PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(
        `🚀 AI TravelMate API running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
}

startServer();