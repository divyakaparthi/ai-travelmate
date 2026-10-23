import { Router } from "express";

import {
  calculatePlaceRoutes,
} from "../services/routing";

const router = Router();

// =====================================================
// Ollama Configuration
// =====================================================

const OLLAMA_API_URL =
  process.env.OLLAMA_API_URL ||
  "http://127.0.0.1:11434/api/generate";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen2.5vl:7b";

// =====================================================
// Types
// =====================================================

type TravelRoute = {
  distanceKm: number;
  durationMinutes: number;
  distanceMeters: number;
  durationSeconds: number;
  source: "OSRM";
};

type ItineraryPlace = {
  name: string;
  travelFromPrevious?: TravelRoute | null;
};

type ItineraryDay = {
  day: number;
  date: string;
  morning: string;
  afternoon: string;
  evening: string;
  places: string[];
  food: string;
  estimatedCost: number;

  // Real routing information.
  routes?: ItineraryPlace[];
};

type Itinerary = {
  destination: string;
  days: ItineraryDay[];

  packingChecklist: string[];

  estimatedExpenses: {
    transport: number;
    food: number;
    activities: number;
    accommodation: number;
    total: number;
  };
};

// =====================================================
// Helper: Clean AI response
// =====================================================

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();

  cleaned = cleaned.replace(
    /^```json\s*/i,
    ""
  );

  cleaned = cleaned.replace(
    /^```\s*/i,
    ""
  );

  cleaned = cleaned.replace(
    /\s*```$/i,
    ""
  );

  const firstBrace = cleaned.indexOf("{");

  if (firstBrace > 0) {
    cleaned = cleaned.substring(firstBrace);
  }

  const lastBrace = cleaned.lastIndexOf("}");

  if (
    lastBrace !== -1 &&
    lastBrace < cleaned.length - 1
  ) {
    cleaned = cleaned.substring(
      0,
      lastBrace + 1
    );
  }

  return cleaned.trim();
}

// =====================================================
// Helper: Extract JSON
// =====================================================

function extractJson(text: string): string {
  const cleaned = cleanJsonResponse(text);

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (
    start === -1 ||
    end === -1 ||
    end <= start
  ) {
    throw new Error(
      "AI response does not contain valid JSON."
    );
  }

  return cleaned.substring(
    start,
    end + 1
  );
}

// =====================================================
// Helper: Validate itinerary
// =====================================================

function validateItinerary(
  data: any
): data is Itinerary {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return false;
  }

  if (
    typeof data.destination !== "string"
  ) {
    return false;
  }

  if (!Array.isArray(data.days)) {
    return false;
  }

  if (
    !Array.isArray(
      data.packingChecklist
    )
  ) {
    return false;
  }

  if (!data.estimatedExpenses) {
    return false;
  }

  const expenses =
    data.estimatedExpenses;

  if (
    typeof expenses.transport !== "number" ||
    typeof expenses.food !== "number" ||
    typeof expenses.activities !== "number" ||
    typeof expenses.accommodation !== "number" ||
    typeof expenses.total !== "number"
  ) {
    return false;
  }

  for (const day of data.days) {
    if (
      typeof day.day !== "number" ||
      typeof day.date !== "string" ||
      typeof day.morning !== "string" ||
      typeof day.afternoon !== "string" ||
      typeof day.evening !== "string" ||
      !Array.isArray(day.places) ||
      typeof day.food !== "string" ||
      typeof day.estimatedCost !== "number"
    ) {
      return false;
    }
  }

  return true;
}

// =====================================================
// Helper: Fallback itinerary
// =====================================================

function createFallbackItinerary(
  destination: string,
  startDate: string,
  endDate: string,
  budget: number
): Itinerary {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const days: ItineraryDay[] = [];

  const current = new Date(start);

  let dayNumber = 1;

  while (current <= end) {
    const date = current.toISOString();

    days.push({
      day: dayNumber,

      date,

      morning:
        `Explore popular attractions in ${destination}.`,

      afternoon:
        `Visit important cultural and historical places in ${destination}.`,

      evening:
        `Enjoy local food and explore the city in the evening.`,

      places: [
        `Popular attractions in ${destination}`,
        `Cultural places in ${destination}`,
      ],

      food:
        `Local food of ${destination}`,

      estimatedCost:
        Math.round(
          budget /
            Math.max(
              1,
              days.length || 1
            )
        ),
    });

    current.setDate(
      current.getDate() + 1
    );

    dayNumber++;

    if (dayNumber > 30) {
      break;
    }
  }

  return {
    destination,

    days,

    packingChecklist: [
      "Comfortable walking shoes",
      "Light and comfortable clothing",
      "Sunscreen",
      "Sunglasses",
      "Reusable water bottle",
      "Mobile phone and charger",
      "Camera",
      "Identification documents",
      "Cash and cards",
    ],

    estimatedExpenses: {
      transport:
        Math.round(
          budget * 0.2
        ),

      food:
        Math.round(
          budget * 0.25
        ),

      activities:
        Math.round(
          budget * 0.2
        ),

      accommodation:
        Math.round(
          budget * 0.35
        ),

      total: budget,
    },
  };
}

// =====================================================
// Add real routing information
// =====================================================

async function addRealRouting(
  itinerary: Itinerary
): Promise<Itinerary> {
  console.log(
    "=========================================="
  );

  console.log(
    "Calculating real road distances/times..."
  );

  console.log(
    "=========================================="
  );

  const updatedDays: ItineraryDay[] = [];

  for (const day of itinerary.days) {
    console.log(
      `Routing Day ${day.day}:`,
      day.places
    );

    try {
      const routeResults =
        await calculatePlaceRoutes(
          day.places,
          itinerary.destination
        );

      const routes: ItineraryPlace[] =
        routeResults.map(
          (result) => ({
            name: result.place,

            travelFromPrevious:
              result.travelFromPrevious,
          })
        );

      updatedDays.push({
        ...day,
        routes,
      });

      console.log(
        `Routing completed for Day ${day.day}`
      );
    } catch (error) {
      console.error(
        `Routing failed for Day ${day.day}:`,
        error
      );

      updatedDays.push({
        ...day,

        routes: day.places.map(
          (place) => ({
            name: place,

            travelFromPrevious:
              null,
          })
        ),
      });
    }
  }

  return {
    ...itinerary,
    days: updatedDays,
  };
}

// =====================================================
// POST /api/ai/generate-itinerary
// =====================================================

router.post(
  "/generate-itinerary",
  async (req, res) => {
    try {
      const {
        destination,
        startDate,
        endDate,
        budget,

        // Support both the old and new frontend names.
        interests,
        preferences,
      } = req.body;

      console.log(
        "AI request:",
        req.body
      );

      // -------------------------------------------------
      // Validation
      // -------------------------------------------------

      if (
        !destination ||
        !startDate ||
        !endDate
      ) {
        return res.status(400).json({
          success: false,
          message:
            "destination, startDate and endDate are required.",
        });
      }

      if (
        budget === undefined ||
        budget === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "budget is required.",
        });
      }

      const numericBudget =
        Number(budget);

      if (
        Number.isNaN(
          numericBudget
        ) ||
        numericBudget <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "budget must be a valid positive number.",
        });
      }

      // -------------------------------------------------
      // Calculate number of days
      // -------------------------------------------------

      const start =
        new Date(startDate);

      const end =
        new Date(endDate);

      if (
        Number.isNaN(
          start.getTime()
        ) ||
        Number.isNaN(
          end.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid startDate or endDate.",
        });
      }

      const diff =
        end.getTime() -
        start.getTime();

      const numberOfDays =
        Math.floor(
          diff /
            (1000 *
              60 *
              60 *
              24)
        ) + 1;

      if (
        numberOfDays <= 0 ||
        numberOfDays > 30
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Trip duration must be between 1 and 30 days.",
        });
      }

      // -------------------------------------------------
      // User preferences
      // -------------------------------------------------

      const userPreferences =
        preferences ||
        interests ||
        "general sightseeing";

      // -------------------------------------------------
      // Prompt
      // -------------------------------------------------

      const prompt = `
You are an expert travel planner.

Create a travel itinerary for:

Destination: ${destination}
Start date: ${startDate}
End date: ${endDate}
Number of days: ${numberOfDays}
Budget: ${numericBudget} Indian Rupees
Preferences: ${userPreferences}

IMPORTANT:

The backend has a REAL routing service using OSRM.

You MUST NOT calculate, estimate, guess,
invent, or include travel distance or
travel duration.

Do NOT write things such as:

"5 km"
"10 km"
"20 minutes"
"30 minutes drive"
"15 minute walk"

The backend will calculate real road
distance and travel duration separately.

Only describe the activities and places.

Return ONLY valid JSON.

DO NOT use markdown.
DO NOT use triple backticks.
DO NOT write explanations before or after the JSON.
DO NOT include comments.

The JSON must follow EXACTLY this structure:

{
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "places": [
        "string",
        "string"
      ],
      "food": "string",
      "estimatedCost": 500
    }
  ],
  "packingChecklist": [
    "string"
  ],
  "estimatedExpenses": {
    "transport": 1000,
    "food": 1000,
    "activities": 500,
    "accommodation": 1000,
    "total": 3500
  }
}

Rules:

1. Generate exactly ${numberOfDays} days.

2. Day numbers must be 1 through ${numberOfDays}.

3. Use dates from ${startDate} through ${endDate}.

4. Each day must contain:
   - morning
   - afternoon
   - evening

5. Each day must contain at least two REAL places.

6. Places should be actual attractions,
   landmarks, restaurants, markets,
   museums, parks or other
   identifiable locations in ${destination}.

7. estimatedCost must be a number.

8. All expense values must be numbers.

9. The total should approximately match
   the budget of ${numericBudget}.

10. Consider the user's preferences:
    ${userPreferences}

11. Keep places geographically sensible
    where possible.

12. Do not include distance or travel-time numbers.

13. Do not output anything outside
    the JSON object.

14. Do not use null for required fields.

15. Keep descriptions concise.

16. Make the itinerary realistic for the
    selected number of days and budget.
`;

      // -------------------------------------------------
      // Ollama request
      // -------------------------------------------------

      console.log(
        "=========================================="
      );

      console.log(
        "Sending request to Ollama..."
      );

      console.log(
        "Ollama URL:",
        OLLAMA_API_URL
      );

      console.log(
        "Ollama model:",
        OLLAMA_MODEL
      );

      console.log(
        "=========================================="
      );

      const response =
        await fetch(
          OLLAMA_API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              model: OLLAMA_MODEL,

              prompt,

              stream: false,

              format: "json",

              options: {
                temperature: 0.2,
              },
            }),
          }
        );

      console.log(
        "Ollama status:",
        response.status
      );

      // -------------------------------------------------
      // Read Ollama response
      // -------------------------------------------------

      const responseText =
        await response.text();

      if (!response.ok) {
        console.error(
          "Ollama error:",
          responseText
        );

        return res.status(502).json({
          success: false,

          message:
            "Ollama failed to generate the itinerary.",

          details:
            responseText,
        });
      }

      let ollamaData: any;

      try {
        ollamaData =
          JSON.parse(
            responseText
          );
      } catch {
        console.error(
          "Ollama returned invalid HTTP response:",
          responseText
        );

        return res.status(502).json({
          success: false,

          message:
            "Ollama returned an invalid response.",

          details:
            responseText,
        });
      }

      console.log(
        "Ollama response received."
      );

      // -------------------------------------------------
      // Extract AI text
      // -------------------------------------------------

      let aiText = "";

      if (
        typeof ollamaData?.response ===
        "string"
      ) {
        aiText =
          ollamaData.response;
      }

      if (!aiText) {
        console.error(
          "Could not find Ollama response:",
          ollamaData
        );

        return res.status(502).json({
          success: false,

          message:
            "AI returned an empty response.",
        });
      }

      console.log(
        "AI response length:",
        aiText.length
      );

      // -------------------------------------------------
      // Parse JSON
      // -------------------------------------------------

      let itinerary: Itinerary;

      try {
        const jsonText =
          extractJson(
            aiText
          );

        itinerary =
          JSON.parse(
            jsonText
          );

        if (
          !validateItinerary(
            itinerary
          )
        ) {
          throw new Error(
            "AI JSON does not match the required itinerary structure."
          );
        }
      } catch (error) {
        console.error(
          "AI JSON parsing/validation failed:",
          error
        );

        console.error(
          "Raw AI response:",
          aiText
        );

        itinerary =
          createFallbackItinerary(
            destination,
            startDate,
            endDate,
            numericBudget
          );
      }

      // -------------------------------------------------
      // Normalize destination
      // -------------------------------------------------

      itinerary.destination =
        destination;

      // -------------------------------------------------
      // Normalize dates and day numbers
      // -------------------------------------------------

      itinerary.days =
        itinerary.days.map(
          (day, index) => {
            const date =
              new Date(start);

            date.setDate(
              start.getDate() +
                index
            );

            return {
              ...day,

              day:
                index + 1,

              date:
                date.toISOString(),
            };
          }
        );

      // -------------------------------------------------
      // REAL ROUTING
      // -------------------------------------------------

      console.log(
        "Adding real OSRM routing..."
      );

      itinerary =
        await addRealRouting(
          itinerary
        );

      // -------------------------------------------------
      // Success
      // -------------------------------------------------

      console.log(
        "=========================================="
      );

      console.log(
        "Itinerary generated successfully."
      );

      console.log(
        "AI provider: Ollama"
      );

      console.log(
        "Model:",
        OLLAMA_MODEL
      );

      console.log(
        "Real OSRM routing added."
      );

      console.log(
        "=========================================="
      );

      return res.status(200).json({
        success: true,

        itinerary,
      });
    } catch (error) {
      console.error(
        "Generate itinerary error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to generate itinerary.",

        details:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

export default router;