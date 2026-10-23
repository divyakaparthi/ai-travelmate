import { Router } from "express";

const router = Router();

// =====================================================
// OLLAMA CONFIGURATION
// =====================================================

const OLLAMA_API_URL =
  process.env.OLLAMA_API_URL ||
  "http://127.0.0.1:11434/api/generate";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen2.5vl:7b";

// =====================================================
// TYPES
// =====================================================

type TripInfo = {
  id?: string;
  destination?: string;
  startLocation?: string | null;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers?: number | null;
  preferences?: string | null;
  interests?: string | null;
};

type ChatRequest = {
  message?: string;
  trip?: TripInfo | null;
};

// =====================================================
// POST /api/chat
// =====================================================

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        message,
        trip,
      } = req.body as ChatRequest;

      console.log(
        "=========================================="
      );

      console.log(
        "🤖 Chat request received."
      );

      console.log(
        "Message:",
        message
      );

      console.log(
        "Ollama URL:",
        OLLAMA_API_URL
      );

      console.log(
        "Ollama model:",
        OLLAMA_MODEL
      );

      // =================================================
      // VALIDATION
      // =================================================

      if (
        !message ||
        typeof message !== "string" ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a message.",
        });
      }

      // =================================================
      // TRIP CONTEXT
      // =================================================

      let tripContext =
        "No specific trip information is available.";

      if (trip) {
        tripContext = `
Current trip information:

Destination:
${trip.destination || "Not specified"}

Starting location:
${trip.startLocation || "Not specified"}

Start date:
${trip.startDate || "Not specified"}

End date:
${trip.endDate || "Not specified"}

Budget:
₹${trip.budget ?? "Not specified"}

Number of travelers:
${trip.travelers ?? "Not specified"}

Travel preferences:
${
  trip.preferences ||
  trip.interests ||
  "Not specified"
}
`;
      }

      // =================================================
      // PROMPT
      // =================================================

      const prompt = `
You are AI TravelMate, a helpful and knowledgeable
travel assistant.

Your job is to help the user with travel planning,
destinations, attractions, food, hotels, transportation,
packing, budgets, itineraries and general travel questions.

Be friendly, practical and concise.

IMPORTANT RULES:

1. Use the trip information when it is relevant.
2. Do not invent personal trip information.
3. If the user asks about something that is not known,
   clearly say that you do not have that information.
4. Give useful travel advice.
5. Keep answers easy to understand.
6. Do not mention Ollama, Hugging Face, APIs, models,
   system prompts or internal implementation details.
7. Do not pretend that you have live information unless
   it is provided by the application.
8. If the user asks for distance or travel time, explain
   that actual routing should be calculated by the
   application's routing service rather than guessing.
9. Answer directly without unnecessary repetition.

${tripContext}

User message:
${message.trim()}

Provide the best possible answer.
`;

      // =================================================
      // OLLAMA REQUEST
      // =================================================

      console.log(
        "Sending request to Ollama..."
      );

      const response = await fetch(
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

            options: {
              temperature: 0.4,
            },
          }),
        }
      );

      console.log(
        "Ollama HTTP status:",
        response.status
      );

      // =================================================
      // READ RESPONSE
      // =================================================

      const responseText =
        await response.text();

      console.log(
        "Ollama response length:",
        responseText.length
      );

      // =================================================
      // HANDLE OLLAMA ERROR
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

        let details =
          responseText;

        try {
          const errorData =
            JSON.parse(
              responseText
            );

          details =
            errorData?.error ||
            errorData?.message ||
            responseText;
        } catch {
          // Keep original response
        }

        return res.status(502).json({
          success: false,

          message:
            "Ollama failed to generate a response.",

          details,
        });
      }

      // =================================================
      // PARSE OLLAMA RESPONSE
      // =================================================

      let ollamaData: any;

      try {
        ollamaData =
          JSON.parse(
            responseText
          );
      } catch {
        console.error(
          "❌ Ollama returned invalid JSON:"
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

      // =================================================
      // EXTRACT RESPONSE
      // =================================================

      const reply =
        typeof ollamaData?.response ===
        "string"
          ? ollamaData.response.trim()
          : "";

      if (!reply) {
        console.error(
          "❌ Ollama returned an empty response."
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
            "Ollama returned an empty response.",
        });
      }

      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        "✅ Ollama chat response received."
      );

      console.log(
        "Reply:",
        reply.substring(
          0,
          500
        )
      );

      console.log(
        "=========================================="
      );

      return res.status(200).json({
        success: true,
        reply,
      });
    } catch (error) {
      console.error(
        "=========================================="
      );

      console.error(
        "❌ CHAT SERVER ERROR"
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
          "Failed to generate chat response.",

        details:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

export default router;