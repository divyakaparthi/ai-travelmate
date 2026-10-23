import { Router } from "express";

const router = Router();

// =====================================================
// Ollama configuration
// =====================================================

const OLLAMA_API_URL =
  process.env.OLLAMA_API_URL ||
  "http://127.0.0.1:11434/api/chat";

const OLLAMA_MODEL =
  process.env.OLLAMA_VISION_MODEL ||
  "qwen2.5vl:7b";

// =====================================================
// Types
// =====================================================

type RecognitionResult = {
  placeName: string;
  confidence: string;
  description: string;
  location: string;
  historicalInformation: string;
  thingsToDo: string[];
  bestTimeToVisit: string;
  estimatedCost: string;
  nearbyAttractions: string[];
};

// =====================================================
// Extract JSON from AI response
// =====================================================

function extractJson(text: string): string {
  let cleaned = text.trim();

  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");

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

  return cleaned.substring(start, end + 1);
}

// =====================================================
// Validate AI result
// =====================================================

function validateResult(
  data: unknown
): data is RecognitionResult {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return false;
  }

  const value =
    data as Record<string, unknown>;

  return (
    typeof value.placeName === "string" &&
    typeof value.confidence === "string" &&
    typeof value.description === "string" &&
    typeof value.location === "string" &&
    typeof value.historicalInformation === "string" &&
    Array.isArray(value.thingsToDo) &&
    value.thingsToDo.every(
      (item) => typeof item === "string"
    ) &&
    typeof value.bestTimeToVisit === "string" &&
    typeof value.estimatedCost === "string" &&
    Array.isArray(value.nearbyAttractions) &&
    value.nearbyAttractions.every(
      (item) => typeof item === "string"
    )
  );
}

// =====================================================
// POST /api/photo-recognition
// =====================================================

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        image,
        destination,
      } = req.body as {
        image?: string;
        destination?: string;
      };

      console.log(
        "=========================================="
      );

      console.log(
        "📸 Photo recognition request received."
      );

      console.log(
        "Destination:",
        destination || "(none)"
      );

      // =================================================
      // Validate image
      // =================================================

      if (
        !image ||
        typeof image !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Image is required.",
        });
      }

      if (
        !image.startsWith("data:image/")
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid image format. Please upload an image file.",
        });
      }

      // =================================================
      // Check image size
      // =================================================

      const approximateSize =
        image.length * 0.75;

      const maxSize =
        8 * 1024 * 1024;

      console.log(
        "Approximate image size:",
        `${(
          approximateSize /
          1024 /
          1024
        ).toFixed(2)} MB`
      );

      if (
        approximateSize >
        maxSize
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image is too large. Please upload a smaller image.",
        });
      }

      // =================================================
      // Check Ollama configuration
      // =================================================

      console.log(
        "Ollama API:",
        OLLAMA_API_URL
      );

      console.log(
        "Ollama model:",
        OLLAMA_MODEL
      );

      // =================================================
      // Prompt
      // =================================================

      const prompt = `
You are AI TravelMate, an expert travel destination
and landmark recognition assistant.

Analyze the uploaded photograph carefully.

Identify the place or landmark shown in the image.

${
  destination
    ? `The user's current trip destination is: ${destination}`
    : ""
}

IMPORTANT:

- Try to identify the exact landmark if possible.
- Use visual evidence from the image.
- If you cannot identify the exact place, provide
  the most likely place and use Low confidence.
- Do not invent facts.
- If the image does not show a recognizable tourist
  location, say that clearly.
- Provide useful travel information.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use code fences.
- Do NOT add explanations outside the JSON.

Return EXACTLY this structure:

{
  "placeName": "Name of the place",
  "confidence": "High",
  "description": "Short description of the place.",
  "location": "City, State, Country",
  "historicalInformation": "Historical information if known.",
  "thingsToDo": [
    "Thing to do 1",
    "Thing to do 2",
    "Thing to do 3"
  ],
  "bestTimeToVisit": "Best time to visit.",
  "estimatedCost": "Approximate visitor cost.",
  "nearbyAttractions": [
    "Nearby attraction 1",
    "Nearby attraction 2",
    "Nearby attraction 3"
  ]
}

Confidence must be exactly one of:

"High"
"Medium"
"Low"

If the image cannot be identified, use:

"placeName": "Unable to identify the place"

and explain the limitation in the description.
`;

      // =================================================
      // Convert data URL into base64
      // =================================================

      const base64Image =
        image.includes(",")
          ? image.split(",")[1]
          : image;

      // =================================================
      // Ollama request
      // =================================================

      console.log(
        "🤖 Sending image to Ollama..."
      );

      const ollamaPayload = {
        model: OLLAMA_MODEL,

        stream: false,

        format: "json",

        messages: [
          {
            role: "user",

            content: prompt,

            images: [
              base64Image,
            ],
          },
        ],

        options: {
          temperature: 0.2,
        },
      };

      const response =
        await fetch(
          OLLAMA_API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify(
              ollamaPayload
            ),
          }
        );

      console.log(
        "Ollama HTTP status:",
        response.status,
        response.statusText
      );

      // =================================================
      // Read response
      // =================================================

      const responseText =
        await response.text();

      console.log(
        "Ollama response length:",
        responseText.length
      );

      // =================================================
      // Handle Ollama errors
      // =================================================

      if (!response.ok) {
        console.error(
          "=========================================="
        );

        console.error(
          "❌ OLLAMA ERROR"
        );

        console.error(
          "Status:",
          response.status
        );

        console.error(
          "Response:",
          responseText
        );

        console.error(
          "=========================================="
        );

        let ollamaErrorMessage =
          responseText;

        try {
          const errorJson =
            JSON.parse(
              responseText
            );

          ollamaErrorMessage =
            errorJson?.error ||
            errorJson?.message ||
            responseText;
        } catch {
          // Keep original response text
        }

        return res.status(502).json({
          success: false,
          message:
            "Ollama failed to analyze the image.",
          details:
            ollamaErrorMessage,
          status:
            response.status,
        });
      }

      // =================================================
      // Parse Ollama response
      // =================================================

      let ollamaData: any;

      try {
        ollamaData =
          JSON.parse(
            responseText
          );
      } catch {
        console.error(
          "❌ Invalid Ollama JSON:"
        );

        console.error(
          responseText
        );

        return res.status(502).json({
          success: false,
          message:
            "Ollama returned an invalid response.",
          details:
            responseText.substring(
              0,
              1000
            ),
        });
      }

      console.log(
        "Ollama response received."
      );

      // =================================================
      // Extract AI response
      // =================================================

      const aiText =
        ollamaData?.message?.content;

      if (
        typeof aiText !== "string" ||
        !aiText.trim()
      ) {
        console.error(
          "❌ No AI vision response."
        );

        console.error(
          JSON.stringify(
            ollamaData,
            null,
            2
          )
        );

        return res.status(502).json({
          success: false,
          message:
            "AI returned an empty image analysis.",
          details:
            "Ollama response did not contain message.content.",
        });
      }

      console.log(
        "AI vision response received."
      );

      console.log(
        "AI response:",
        aiText.substring(
          0,
          1000
        )
      );

      // =================================================
      // Parse JSON
      // =================================================

      let result: RecognitionResult;

      try {
        const jsonText =
          extractJson(aiText);

        const parsed =
          JSON.parse(
            jsonText
          );

        if (
          !validateResult(
            parsed
          )
        ) {
          throw new Error(
            "AI response does not match the required structure."
          );
        }

        result = parsed;
      } catch (error) {
        console.error(
          "❌ Vision JSON error:",
          error
        );

        console.error(
          "AI raw response:",
          aiText
        );

        return res.status(502).json({
          success: false,
          message:
            "AI returned an invalid place recognition result.",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        });
      }

      // =================================================
      // Success
      // =================================================

      console.log(
        "✅ Place recognized successfully:",
        result.placeName
      );

      console.log(
        "=========================================="
      );

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(
        "=========================================="
      );

      console.error(
        "❌ PHOTO RECOGNITION SERVER ERROR"
      );

      console.error(
        error
      );

      console.error(
        "=========================================="
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to recognize the place.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

export default router;