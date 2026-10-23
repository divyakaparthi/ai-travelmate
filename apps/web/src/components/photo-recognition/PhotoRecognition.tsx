import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

/* =========================================================
   TYPES
   ========================================================= */

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

type PhotoRecognitionProps = {
  destination?: string;
};

/* =========================================================
   IMAGE COMPRESSION SETTINGS
   ========================================================= */

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB original file
const MAX_IMAGE_WIDTH = 1600;
const MAX_IMAGE_HEIGHT = 1600;
const JPEG_QUALITY = 0.75;

/*
 * The final base64 image should normally be much smaller
 * than the original image.
 */
const MAX_BASE64_LENGTH = 5 * 1024 * 1024;

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PhotoRecognition({
  destination,
}: PhotoRecognitionProps) {
  /* =======================================================
     REF
     ======================================================= */

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* =======================================================
     STATE
     ======================================================= */

  const [image, setImage] = useState<string | null>(null);

  const [result, setResult] =
    useState<RecognitionResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [processingImage, setProcessingImage] =
    useState(false);

  const [error, setError] = useState("");

  const [dragging, setDragging] = useState(false);

  /* =======================================================
     COMPRESS / RESIZE IMAGE
     ======================================================= */

  function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);

      const img = new Image();

      img.onload = () => {
        try {
          let width = img.naturalWidth;
          let height = img.naturalHeight;

          /* -----------------------------------------------
             Resize while maintaining aspect ratio
             ----------------------------------------------- */

          if (
            width > MAX_IMAGE_WIDTH ||
            height > MAX_IMAGE_HEIGHT
          ) {
            const widthRatio =
              MAX_IMAGE_WIDTH / width;

            const heightRatio =
              MAX_IMAGE_HEIGHT / height;

            const scale = Math.min(
              widthRatio,
              heightRatio
            );

            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          /* -----------------------------------------------
             Canvas
             ----------------------------------------------- */

          const canvas =
            document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const context =
            canvas.getContext("2d");

          if (!context) {
            URL.revokeObjectURL(objectUrl);

            reject(
              new Error(
                "Your browser does not support image processing."
              )
            );

            return;
          }

          /*
           * White background prevents transparent PNGs from
           * becoming black when converted to JPEG.
           */
          context.fillStyle = "#ffffff";

          context.fillRect(
            0,
            0,
            width,
            height
          );

          context.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          URL.revokeObjectURL(objectUrl);

          /* -----------------------------------------------
             Convert to compressed JPEG
             ----------------------------------------------- */

          const compressed =
            canvas.toDataURL(
              "image/jpeg",
              JPEG_QUALITY
            );

          if (
            compressed.length >
            MAX_BASE64_LENGTH
          ) {
            /*
             * Try a second, stronger compression if the
             * first result is still too large.
             */
            const smaller =
              canvas.toDataURL(
                "image/jpeg",
                0.55
              );

            if (
              smaller.length >
              MAX_BASE64_LENGTH
            ) {
              reject(
                new Error(
                  "The image is still too large after compression. Please choose a smaller image."
                )
              );

              return;
            }

            resolve(smaller);
            return;
          }

          resolve(compressed);
        } catch (compressionError) {
          URL.revokeObjectURL(objectUrl);

          reject(
            compressionError instanceof Error
              ? compressionError
              : new Error(
                  "Failed to process the image."
                )
          );
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);

        reject(
          new Error(
            "Failed to load the selected image."
          )
        );
      };

      img.src = objectUrl;
    });
  }

  /* =======================================================
     HANDLE FILE
     ======================================================= */

  async function handleFile(file: File) {
    setError("");
    setResult(null);

    /* -----------------------------------------------
       Check file type
       ----------------------------------------------- */

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    /* -----------------------------------------------
       Check original file size
       ----------------------------------------------- */

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Image must be smaller than 15 MB."
      );
      return;
    }

    try {
      setProcessingImage(true);

      /*
       * Compress and resize the image BEFORE storing
       * it in state.
       */
      const compressedImage =
        await compressImage(file);

      setImage(compressedImage);
    } catch (err) {
      console.error(
        "Image processing error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to process the image."
      );
    } finally {
      setProcessingImage(false);
    }
  }

  /* =======================================================
     FILE INPUT
     ======================================================= */

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (file) {
      void handleFile(file);
    }
  }

  /* =======================================================
     DRAG OVER
     ======================================================= */

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setDragging(true);
  }

  /* =======================================================
     DRAG LEAVE
     ======================================================= */

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);
  }

  /* =======================================================
     DROP
     ======================================================= */

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      void handleFile(file);
    }
  }

  /* =======================================================
     OPEN FILE SELECTOR
     ======================================================= */

  function openFileSelector() {
    if (processingImage || loading) {
      return;
    }

    fileInputRef.current?.click();
  }

  /* =======================================================
     RECOGNIZE PLACE
     ======================================================= */

  async function recognizePlace() {
    if (!image) {
      setError(
        "Please select an image first."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      /* -----------------------------------------------
         Check login
         ----------------------------------------------- */

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not logged in. Please login first."
        );
      }

      /* -----------------------------------------------
         Send compressed image
         ----------------------------------------------- */

      const response =
        await fetch(
          "http://localhost:5000/api/photo-recognition",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              image,
              destination:
                destination || "",
            }),
          }
        );

      /* -----------------------------------------------
         Read response safely
         ----------------------------------------------- */

      const responseText =
        await response.text();

      let data: any = null;

      if (responseText) {
        try {
          data =
            JSON.parse(responseText);
        } catch {
          if (response.status === 413) {
            throw new Error(
              "The image is too large for the server. Please choose another image."
            );
          }

          throw new Error(
            "Server returned an invalid response."
          );
        }
      }

      /* -----------------------------------------------
         Handle HTTP errors
         ----------------------------------------------- */

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            "The image is too large for the server. Please choose a smaller image."
          );
        }

        throw new Error(
          data?.message ||
            data?.error ||
            data?.details ||
            `Request failed with status ${response.status}.`
        );
      }

      /* -----------------------------------------------
         Validate API response
         ----------------------------------------------- */

      if (
        !data ||
        data.success !== true ||
        !data.result
      ) {
        throw new Error(
          "AI did not return a valid place recognition result."
        );
      }

      setResult(
        data.result as RecognitionResult
      );
    } catch (err) {
      console.error(
        "Photo recognition error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to recognize the place."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     REMOVE IMAGE
     ======================================================= */

  function removeImage() {
    if (loading) {
      return;
    }

    setImage(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section style={styles.container}>

      {/* =================================================
          HEADER
          ================================================= */}

      <div style={styles.header}>

        <p style={styles.label}>
          AI VISION
        </p>

        <h2 style={styles.title}>
          📸 Identify a Place
        </h2>

        <p style={styles.description}>
          Upload a photo of a landmark,
          building, park, monument or
          tourist attraction and let AI
          identify it.
        </p>

        {destination && (
          <div
            style={styles.destinationBadge}
          >
            📍 Trip destination:{" "}
            <strong>
              {destination}
            </strong>
          </div>
        )}

      </div>

      {/* =================================================
          UPLOAD AREA
          ================================================= */}

      {!image && (
        <div
          style={{
            ...styles.uploadBox,

            ...(dragging
              ? styles.uploadBoxDragging
              : {}),
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileSelector}
          role="button"
          tabIndex={0}
          aria-label="Upload an image"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              openFileSelector();
            }
          }}
        >

          <div style={styles.uploadIcon}>
            {processingImage
              ? "⏳"
              : "📷"}
          </div>

          <h3 style={styles.uploadTitle}>
            {processingImage
              ? "Processing image..."
              : "Upload a photo"}
          </h3>

          <p style={styles.uploadText}>
            {processingImage
              ? "Please wait while the image is resized and compressed."
              : "Click here or drag and drop an image"}
          </p>

          <p style={styles.uploadHint}>
            JPG, JPEG, PNG or WEBP •
            Maximum 15 MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            disabled={processingImage}
            style={{
              display: "none",
            }}
          />

        </div>
      )}

      {/* =================================================
          IMAGE PREVIEW
          ================================================= */}

      {image && (
        <div style={styles.previewCard}>

          <div style={styles.previewHeader}>

            <h3 style={styles.previewTitle}>
              Selected Photo
            </h3>

            <button
              type="button"
              onClick={removeImage}
              disabled={loading}
              style={styles.smallRemoveButton}
            >
              ✕ Remove
            </button>

          </div>

          <img
            src={image}
            alt="Selected place"
            style={styles.previewImage}
          />

          <p style={styles.compressionInfo}>
            ✓ Image resized and compressed
            before upload
          </p>

          <div style={styles.previewActions}>

            <button
              type="button"
              onClick={recognizePlace}
              disabled={
                loading ||
                processingImage
              }
              style={{
                ...styles.recognizeButton,
                opacity:
                  loading ||
                  processingImage
                    ? 0.7
                    : 1,
              }}
            >
              {loading
                ? "🤖 Analyzing..."
                : "✨ Identify This Place"}
            </button>

            <button
              type="button"
              onClick={removeImage}
              disabled={loading}
              style={styles.removeButton}
            >
              Choose Another Photo
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          ERROR
          ================================================= */}

      {error && (
        <div style={styles.error}>

          <strong>
            ❌ Error
          </strong>

          <p style={styles.errorMessage}>
            {error}
          </p>

        </div>
      )}

      {/* =================================================
          RESULT
          ================================================= */}

      {result && (
        <div style={styles.resultCard}>

          {/* =============================================
              HEADER
              ============================================= */}

          <div style={styles.resultHeader}>

            <div>

              <p style={styles.label}>
                AI IDENTIFIED
              </p>

              <h2 style={styles.placeName}>
                📍 {result.placeName}
              </h2>

            </div>

            <span style={styles.confidence}>
              {result.confidence}{" "}
              Confidence
            </span>

          </div>

          {/* =============================================
              ABOUT
              ============================================= */}

          <div style={styles.resultSection}>

            <h3 style={styles.resultHeading}>
              📝 About this place
            </h3>

            <p style={styles.resultText}>
              {result.description}
            </p>

          </div>

          {/* =============================================
              LOCATION
              ============================================= */}

          <div style={styles.resultSection}>

            <h3 style={styles.resultHeading}>
              📍 Location
            </h3>

            <p style={styles.resultText}>
              {result.location}
            </p>

          </div>

          {/* =============================================
              HISTORY
              ============================================= */}

          <div style={styles.resultSection}>

            <h3 style={styles.resultHeading}>
              🏛️ Historical Information
            </h3>

            <p style={styles.resultText}>
              {result.historicalInformation}
            </p>

          </div>

          {/* =============================================
              THINGS TO DO
              ============================================= */}

          <div style={styles.resultSection}>

            <h3 style={styles.resultHeading}>
              🎯 Things to Do
            </h3>

            {Array.isArray(
              result.thingsToDo
            ) &&
            result.thingsToDo.length > 0 ? (

              <ul style={styles.list}>

                {result.thingsToDo.map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                      style={styles.listItem}
                    >
                      {item}
                    </li>
                  )
                )}

              </ul>

            ) : (

              <p style={styles.resultText}>
                No activities were provided.
              </p>

            )}

          </div>

          {/* =============================================
              BEST TIME
              ============================================= */}

          <div style={styles.resultSection}>

            <h3 style={styles.resultHeading}>
              🕐 Best Time to Visit
            </h3>

            <p style={styles.resultText}>
              {result.bestTimeToVisit}
            </p>

          </div>

          {/* =============================================
              COST
              ============================================= */}

          <div style={styles.resultSection}>

            <h3 style={styles.resultHeading}>
              💰 Estimated Cost
            </h3>

            <p style={styles.resultText}>
              {result.estimatedCost}
            </p>

          </div>

          {/* =============================================
              NEARBY
              ============================================= */}

          <div style={styles.resultSection}>

            <h3 style={styles.resultHeading}>
              🗺️ Nearby Attractions
            </h3>

            {Array.isArray(
              result.nearbyAttractions
            ) &&
            result.nearbyAttractions.length > 0 ? (

              <div style={styles.tags}>

                {result.nearbyAttractions.map(
                  (place, index) => (
                    <span
                      key={`${place}-${index}`}
                      style={styles.tag}
                    >
                      {place}
                    </span>
                  )
                )}

              </div>

            ) : (

              <p style={styles.resultText}>
                No nearby attractions were provided.
              </p>

            )}

          </div>

        </div>
      )}

    </section>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const styles: Record<
  string,
  React.CSSProperties
> = {
  container: {
    marginTop: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.06)",
  },

  header: {
    marginBottom: "25px",
  },

  label: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#6b7280",
  },

  title: {
    margin: "8px 0",
    fontSize: "28px",
    color: "#111827",
  },

  description: {
    margin: 0,
    color: "#6b7280",
    lineHeight: 1.6,
    maxWidth: "750px",
  },

  destinationBadge: {
    display: "inline-block",
    marginTop: "15px",
    padding: "8px 13px",
    borderRadius: "20px",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "14px",
  },

  uploadBox: {
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "50px 25px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f8fafc",
    transition:
      "border-color 0.2s, background-color 0.2s",
  },

  uploadBoxDragging: {
    border: "2px dashed #2563eb",
    backgroundColor: "#eff6ff",
  },

  uploadIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  uploadTitle: {
    margin: "5px 0",
    color: "#111827",
  },

  uploadText: {
    color: "#475569",
    margin: "8px 0",
  },

  uploadHint: {
    color: "#94a3b8",
    fontSize: "13px",
  },

  previewCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "15px",
    padding: "18px",
  },

  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  previewTitle: {
    margin: 0,
    color: "#111827",
  },

  smallRemoveButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#dc2626",
    fontWeight: 600,
    cursor: "pointer",
  },

  previewImage: {
    display: "block",
    width: "100%",
    maxHeight: "500px",
    objectFit: "contain",
    borderRadius: "12px",
    backgroundColor: "#e5e7eb",
  },

  compressionInfo: {
    margin:
      "10px 0 0",
    textAlign: "center",
    color: "#047857",
    fontSize: "13px",
    fontWeight: 600,
  },

  previewActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "18px",
    flexWrap: "wrap",
  },

  recognizeButton: {
    border: "none",
    borderRadius: "10px",
    padding: "13px 22px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
  },

  removeButton: {
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "13px 22px",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    marginTop: "18px",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },

  errorMessage: {
    margin: "6px 0 0",
    lineHeight: 1.5,
  },

  resultCard: {
    marginTop: "25px",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "25px",
    backgroundColor: "#ffffff",
  },

  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
  },

  placeName: {
    margin: "8px 0 0",
    fontSize: "30px",
    color: "#111827",
  },

  confidence: {
    padding: "7px 12px",
    borderRadius: "20px",
    backgroundColor: "#ecfdf5",
    color: "#047857",
    fontSize: "13px",
    fontWeight: 700,
  },

  resultSection: {
    marginTop: "22px",
  },

  resultHeading: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "18px",
  },

  resultText: {
    margin: 0,
    color: "#4b5563",
    lineHeight: 1.7,
  },

  list: {
    marginTop: "8px",
    marginBottom: 0,
    paddingLeft: "22px",
    lineHeight: 1.8,
  },

  listItem: {
    color: "#4b5563",
    marginBottom: "5px",
  },

  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  tag: {
    padding: "8px 12px",
    borderRadius: "20px",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "14px",
  },
};