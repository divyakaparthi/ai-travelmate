import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  chatWithAI,
  type Trip,
} from "../../api";

/* =========================================================
   TYPES
   ========================================================= */

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatbotProps = {
  trip?: Trip | null;
};

/* =========================================================
   SPEECH RECOGNITION TYPES
   ========================================================= */

type SpeechRecognitionEventLike = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Chatbot({
  trip,
}: ChatbotProps) {
  /* =======================================================
     STATE
     ======================================================= */

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "👋 Hi! I'm AI TravelMate. Ask me anything about your trip, places to visit, food, transport, budget, packing, or travel plans.",
    },
  ]);

  const [input, setInput] = useState("");

  const [sending, setSending] = useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [error, setError] = useState("");

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  /* =======================================================
     AUTO SCROLL
     ======================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =======================================================
     SPEAK TEXT
     ======================================================= */

  function speakText(text: string) {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  }

  /* =======================================================
     START VOICE RECOGNITION
     ======================================================= */

  function startListening() {
    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    setError("");

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);

      setError(
        "Could not hear your voice. Please try again."
      );
    };

    recognition.onresult = (
      event: SpeechRecognitionEventLike
    ) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error(
        "Voice recognition error:",
        err
      );

      setIsListening(false);
    }
  }

  /* =======================================================
     STOP VOICE RECOGNITION
     ======================================================= */

  function stopListening() {
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.error(
        "Stop voice recognition error:",
        err
      );
    }

    setIsListening(false);
  }

  /* =======================================================
     SEND MESSAGE
     ======================================================= */

  async function handleSend() {
    const message = input.trim();

    if (!message) {
      return;
    }

    if (sending) {
      return;
    }

    setError("");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setSending(true);

    try {
      /* ===================================================
         SEND TO BACKEND

         chatWithAI returns a STRING.
         =================================================== */

      const reply = await chatWithAI(
        message,
        trip
      );

      /* ===================================================
         CREATE ASSISTANT MESSAGE
         =================================================== */

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      /* ===================================================
         AUTOMATICALLY READ AI RESPONSE

         IMPORTANT:
         speakText accepts ONLY ONE argument.
         =================================================== */

      speakText(reply);
    } catch (err) {
      console.error(
        "Chat request error:",
        err
      );

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get a response from AI.";

      setError(errorMessage);

      const assistantError: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Sorry, I couldn't process your request right now. Please try again.",
      };

      setMessages((previous) => [
        ...previous,
        assistantError,
      ]);
    } finally {
      setSending(false);
    }
  }

  /* =======================================================
     ENTER KEY
     ======================================================= */

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();

      void handleSend();
    }
  }

  /* =======================================================
     STOP SPEECH
     ======================================================= */

  function stopSpeaking() {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }
  }

  /* =======================================================
     CLEANUP
     ======================================================= */

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore cleanup errors
      }

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section style={styles.wrapper}>
      {/* =================================================
          HEADER
          ================================================= */}

      <div style={styles.header}>
        <div style={styles.headerIcon}>
          🤖
        </div>

        <div>
          <h2 style={styles.headerTitle}>
            AI TravelMate
          </h2>

          <p style={styles.headerSubtitle}>
            Your personal travel assistant
          </p>
        </div>
      </div>

      {/* =================================================
          TRIP INFORMATION
          ================================================= */}

      {trip && (
        <div style={styles.tripInfo}>
          <strong>
            📍 {trip.destination}
          </strong>

          <span>
            💰 ₹
            {trip.budget.toLocaleString(
              "en-IN"
            )}
          </span>

          {trip.interests && (
            <span>
              ❤️ {trip.interests}
            </span>
          )}
        </div>
      )}

      {/* =================================================
          ERROR
          ================================================= */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* =================================================
          MESSAGES
          ================================================= */}

      <div style={styles.messages}>
        {messages.map((message) => {
          const isUser =
            message.role === "user";

          return (
            <div
              key={message.id}
              style={{
                ...styles.messageRow,
                justifyContent: isUser
                  ? "flex-end"
                  : "flex-start",
              }}
            >
              {!isUser && (
                <div style={styles.botAvatar}>
                  🤖
                </div>
              )}

              <div
                style={{
                  ...styles.messageBubble,
                  ...(isUser
                    ? styles.userBubble
                    : styles.assistantBubble),
                }}
              >
                {message.content}
              </div>

              {isUser && (
                <div style={styles.userAvatar}>
                  👤
                </div>
              )}
            </div>
          );
        })}

        {/* =================================================
            TYPING INDICATOR
            ================================================= */}

        {sending && (
          <div style={styles.messageRow}>
            <div style={styles.botAvatar}>
              🤖
            </div>

            <div
              style={{
                ...styles.messageBubble,
                ...styles.assistantBubble,
              }}
            >
              <span>AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* =================================================
          VOICE STATUS
          ================================================= */}

      {isListening && (
        <div style={styles.listening}>
          🎤 Listening... Speak now
        </div>
      )}

      {/* =================================================
          INPUT
          ================================================= */}

      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask AI TravelMate anything..."
          disabled={sending}
          style={styles.input}
        />

        {/* Voice button */}

        <button
          type="button"
          onClick={startListening}
          disabled={sending}
          title={
            isListening
              ? "Stop listening"
              : "Speak"
          }
          style={{
            ...styles.voiceButton,
            backgroundColor: isListening
              ? "#dc2626"
              : "#f3f4f6",
          }}
        >
          {isListening ? "⏹️" : "🎤"}
        </button>

        {/* Send button */}

        <button
          type="button"
          onClick={() => {
            void handleSend();
          }}
          disabled={
            sending || !input.trim()
          }
          style={{
            ...styles.sendButton,
            opacity:
              sending || !input.trim()
                ? 0.5
                : 1,
          }}
        >
          {sending ? "..." : "➤"}
        </button>
      </div>

      {/* =================================================
          SPEECH CONTROLS
          ================================================= */}

      <div style={styles.voiceControls}>
        <button
          type="button"
          onClick={stopSpeaking}
          style={styles.smallButton}
        >
          🔇 Stop AI Voice
        </button>

        <span style={styles.voiceHelp}>
          🎤 Tap microphone to speak
        </span>
      </div>
    </section>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const styles: Record<
  string,
  CSSProperties
> = {
  wrapper: {
    width: "100%",
    maxWidth: "850px",
    margin: "30px auto",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 10px 35px rgba(0,0,0,0.08)",
    border:
      "1px solid #e5e7eb",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px 24px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },

  headerIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },

  headerTitle: {
    margin: 0,
    fontSize: "21px",
  },

  headerSubtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    opacity: 0.9,
  },

  tripInfo: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    padding: "12px 20px",
    backgroundColor: "#eff6ff",
    color: "#1e3a8a",
    fontSize: "13px",
    borderBottom:
      "1px solid #dbeafe",
  },

  error: {
    margin: "12px 18px 0",
    padding: "12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    borderRadius: "8px",
    fontSize: "14px",
  },

  messages: {
    minHeight: "450px",
    maxHeight: "600px",
    overflowY: "auto",
    padding: "20px",
    backgroundColor: "#f8fafc",
  },

  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    marginBottom: "15px",
  },

  botAvatar: {
    width: "34px",
    height: "34px",
    minWidth: "34px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  userAvatar: {
    width: "34px",
    height: "34px",
    minWidth: "34px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  messageBubble: {
    maxWidth: "75%",
    padding: "13px 16px",
    borderRadius: "15px",
    lineHeight: 1.55,
    fontSize: "15px",
    whiteSpace: "pre-wrap",
  },

  userBubble: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderBottomRightRadius: "4px",
  },

  assistantBubble: {
    backgroundColor: "#ffffff",
    color: "#111827",
    border:
      "1px solid #e5e7eb",
    borderBottomLeftRadius: "4px",
  },

  listening: {
    padding: "10px 20px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    textAlign: "center",
    fontWeight: 600,
    fontSize: "14px",
  },

  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "15px",
    borderTop:
      "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },

  input: {
    flex: 1,
    minWidth: 0,
    padding: "13px 15px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    outline: "none",
    fontSize: "15px",
  },

  voiceButton: {
    width: "48px",
    height: "48px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "19px",
  },

  sendButton: {
    width: "48px",
    height: "48px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: 700,
  },

  voiceControls: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "0 15px 15px",
  },

  smallButton: {
    padding: "8px 12px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontSize: "12px",
  },

  voiceHelp: {
    color: "#6b7280",
    fontSize: "12px",
  },
};