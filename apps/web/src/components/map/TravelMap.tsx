import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// =====================================================
// Types
// =====================================================

type Coordinates = {
  latitude: number;
  longitude: number;
  displayName: string;
};

type TravelMapProps = {
  destination?: string;
};

// =====================================================
// Leaflet marker icons
// =====================================================

delete (
  L.Icon.Default.prototype as unknown as {
    _getIconUrl?: unknown;
  }
)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// =====================================================
// Geocoding
// =====================================================

async function geocodeDestination(
  destination: string
): Promise<Coordinates | null> {
  const cleanDestination = destination.trim();

  if (!cleanDestination) {
    return null;
  }

  const url = new URL(
    "https://nominatim.openstreetmap.org/search"
  );

  url.searchParams.set("q", cleanDestination);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Geocoding failed with status ${response.status}`
      );
    }

    const data = (await response.json()) as Array<{
      lat?: string;
      lon?: string;
      display_name?: string;
    }>;

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const result = data[0];

    const latitude = Number(result.lat);
    const longitude = Number(result.lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null;
    }

    return {
      latitude,
      longitude,
      displayName:
        result.display_name || cleanDestination,
    };
  } catch (error) {
    console.error(
      "Destination geocoding failed:",
      error
    );

    return null;
  }
}

// =====================================================
// Map controller
// =====================================================

function MapController({
  coordinates,
}: {
  coordinates: Coordinates;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [
        coordinates.latitude,
        coordinates.longitude,
      ],
      12,
      {
        animate: true,
      }
    );
  }, [
    map,
    coordinates.latitude,
    coordinates.longitude,
  ]);

  return null;
}

// =====================================================
// Travel Map
// =====================================================

export default function TravelMap({
  destination,
}: TravelMapProps) {
  const [coordinates, setCoordinates] =
    useState<Coordinates | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCoordinates() {
      const cleanDestination =
        destination?.trim();

      if (!cleanDestination) {
        setCoordinates(null);
        setError(
          "Destination is not available."
        );
        return;
      }

      setLoading(true);
      setError("");

      const result =
        await geocodeDestination(
          cleanDestination
        );

      if (cancelled) {
        return;
      }

      if (!result) {
        setCoordinates(null);
        setError(
          `Could not find "${cleanDestination}" on the map.`
        );
      } else {
        setCoordinates(result);
      }

      setLoading(false);
    }

    void loadCoordinates();

    return () => {
      cancelled = true;
    };
  }, [destination]);

  // ===================================================
  // No destination
  // ===================================================

  if (!destination?.trim()) {
    return (
      <section style={styles.wrapper}>
        <Header />

        <div style={styles.message}>
          Destination information is not available.
        </div>
      </section>
    );
  }

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <section style={styles.wrapper}>
        <Header />

        <div style={styles.loading}>
          <div style={styles.spinner}>⏳</div>

          <strong>
            Finding {destination}...
          </strong>

          <p>
            Getting the location automatically
            from OpenStreetMap.
          </p>
        </div>
      </section>
    );
  }

  // ===================================================
  // Error
  // ===================================================

  if (!coordinates) {
    return (
      <section style={styles.wrapper}>
        <Header />

        <div style={styles.error}>
          <div style={styles.errorIcon}>
            📍
          </div>

          <strong>
            Location not found
          </strong>

          <p>
            {error ||
              `We could not find ${destination}.`}
          </p>

          <small>
            Try entering a city such as Mumbai,
            Pune, Hyderabad, Delhi, Bengaluru,
            or Chennai.
          </small>
        </div>
      </section>
    );
  }

  // ===================================================
  // SINGLE MAP
  // ===================================================

  return (
    <section style={styles.wrapper}>
      <div style={styles.header}>
        <p style={styles.label}>
          NAVIGATION
        </p>

        <h2 style={styles.title}>
          🗺️ Travel Map
        </h2>

        <p style={styles.subtitle}>
          Showing the location of{" "}
          <strong>{destination}</strong>
        </p>
      </div>

      <div style={styles.mapWrapper}>
        <MapContainer
          center={[
            coordinates.latitude,
            coordinates.longitude,
          ]}
          zoom={12}
          scrollWheelZoom={true}
          style={styles.map}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            coordinates={coordinates}
          />

          <Marker
            position={[
              coordinates.latitude,
              coordinates.longitude,
            ]}
          >
            <Popup>
              <strong>{destination}</strong>
              <br />
              {coordinates.displayName}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div style={styles.locationInfo}>
        <span>📍</span>

        <div>
          <strong>{destination}</strong>

          <p>
            {coordinates.displayName}
          </p>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// Header
// =====================================================

function Header() {
  return (
    <div style={styles.header}>
      <p style={styles.label}>
        NAVIGATION
      </p>

      <h2 style={styles.title}>
        🗺️ Travel Map
      </h2>
    </div>
  );
}

// =====================================================
// Styles
// =====================================================

const styles: Record<
  string,
  React.CSSProperties
> = {
  wrapper: {
    width: "100%",
    overflow: "hidden",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  header: {
    padding: "28px 30px 20px",
  },

  label: {
    margin: "0 0 6px",
    color: "#6366f1",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
  },

  title: {
    margin: 0,
    color: "#111827",
    fontSize: "28px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    lineHeight: 1.6,
  },

  mapWrapper: {
    width: "100%",
    height: "430px",
  },

  map: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },

  locationInfo: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    padding: "18px 25px",
    backgroundColor: "#f8fafc",
    borderTop:
      "1px solid #e5e7eb",
  },

  message: {
    margin: "0 25px 25px",
    padding: "25px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    textAlign: "center",
  },

  loading: {
    margin: "0 25px 25px",
    padding: "40px 25px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    textAlign: "center",
  },

  spinner: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  error: {
    margin: "0 25px 25px",
    padding: "35px 25px",
    borderRadius: "14px",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    textAlign: "center",
  },

  errorIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },
};