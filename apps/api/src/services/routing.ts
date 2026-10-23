// =====================================================
// AI TravelMate - Real Routing Service
// Uses OpenStreetMap Nominatim for geocoding
// and OSRM for real road distance/time.
// =====================================================

type Coordinates = {
  latitude: number;
  longitude: number;
  displayName: string;
};

export type RouteResult = {
  distanceKm: number;
  durationMinutes: number;
  distanceMeters: number;
  durationSeconds: number;
  source: "OSRM";
};

type NominatimResult = {
  lat?: string;
  lon?: string;
  display_name?: string;
};

type OsrmResponse = {
  code?: string;
  routes?: Array<{
    distance?: number;
    duration?: number;
  }>;
};

// -----------------------------------------------------
// Configuration
// -----------------------------------------------------

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving";

// Identify our application to Nominatim.
// You can optionally set APP_URL in .env.
const APP_URL =
  process.env.APP_URL ||
  "http://localhost:5000";

const USER_AGENT =
  `AI-TravelMate/1.0 (${APP_URL})`;

// -----------------------------------------------------
// Simple in-memory geocoding cache
// -----------------------------------------------------

const geocodeCache =
  new Map<string, Coordinates | null>();

// -----------------------------------------------------
// Nominatim request throttling
//
// Nominatim asks clients to stay at or below
// 1 request per second.
// -----------------------------------------------------

let lastGeocodeRequestTime = 0;

async function waitForGeocodeSlot(): Promise<void> {
  const now = Date.now();

  const elapsed =
    now - lastGeocodeRequestTime;

  const minimumInterval = 1100;

  if (elapsed < minimumInterval) {
    await new Promise((resolve) => {
      setTimeout(
        resolve,
        minimumInterval - elapsed
      );
    });
  }

  lastGeocodeRequestTime = Date.now();
}

// -----------------------------------------------------
// Geocode place
// -----------------------------------------------------

export async function geocodePlace(
  placeName: string,
  destination: string
): Promise<Coordinates | null> {
  const cleanPlace =
    placeName.trim();

  if (!cleanPlace) {
    return null;
  }

  const query =
    `${cleanPlace}, ${destination}`;

  const cacheKey =
    query.toLowerCase();

  // Check cache first.
  if (geocodeCache.has(cacheKey)) {
    return (
      geocodeCache.get(cacheKey) ??
      null
    );
  }

  await waitForGeocodeSlot();

  const url =
    new URL(NOMINATIM_URL);

  url.searchParams.set(
    "q",
    query
  );

  url.searchParams.set(
    "format",
    "jsonv2"
  );

  url.searchParams.set(
    "limit",
    "1"
  );

  try {
    console.log(
      `Geocoding: ${query}`
    );

    const response =
      await fetch(
        url.toString(),
        {
          method: "GET",
          headers: {
            Accept:
              "application/json",
            "User-Agent":
              USER_AGENT,
            Referer:
              APP_URL,
          },
        }
      );

    if (!response.ok) {
      console.error(
        `Nominatim error ${response.status} for ${query}`
      );

      geocodeCache.set(
        cacheKey,
        null
      );

      return null;
    }

    const data =
      (await response.json()) as NominatimResult[];

    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {
      console.warn(
        `Could not geocode: ${query}`
      );

      geocodeCache.set(
        cacheKey,
        null
      );

      return null;
    }

    const result = data[0];

    const latitude =
      Number(result.lat);

    const longitude =
      Number(result.lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      geocodeCache.set(
        cacheKey,
        null
      );

      return null;
    }

    const coordinates: Coordinates = {
      latitude,
      longitude,
      displayName:
        result.display_name ||
        query,
    };

    geocodeCache.set(
      cacheKey,
      coordinates
    );

    console.log(
      `Geocoded "${query}" -> ${latitude}, ${longitude}`
    );

    return coordinates;
  } catch (error) {
    console.error(
      `Geocoding failed for "${query}":`,
      error
    );

    geocodeCache.set(
      cacheKey,
      null
    );

    return null;
  }
}

// -----------------------------------------------------
// Get real road route between two places
// -----------------------------------------------------

export async function getDrivingRoute(
  from: Coordinates,
  to: Coordinates
): Promise<RouteResult | null> {
  const coordinates =
    `${from.longitude},${from.latitude};` +
    `${to.longitude},${to.latitude}`;

  const url =
    `${OSRM_URL}/${coordinates}` +
    `?overview=false`;

  try {
    console.log(
      `Routing: ${from.displayName} -> ${to.displayName}`
    );

    const response =
      await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            "application/json",
          "User-Agent":
            "AI-TravelMate/1.0",
        },
      });

    if (!response.ok) {
      console.error(
        `OSRM HTTP error ${response.status}`
      );

      return null;
    }

    const data =
      (await response.json()) as OsrmResponse;

    if (
      data.code !== "Ok" ||
      !data.routes ||
      data.routes.length === 0
    ) {
      console.warn(
        "OSRM could not find a route:",
        data
      );

      return null;
    }

    const route =
      data.routes[0];

    const distanceMeters =
      Number(route.distance);

    const durationSeconds =
      Number(route.duration);

    if (
      !Number.isFinite(
        distanceMeters
      ) ||
      !Number.isFinite(
        durationSeconds
      )
    ) {
      return null;
    }

    const distanceKm =
      Number(
        (
          distanceMeters / 1000
        ).toFixed(1)
      );

    const durationMinutes =
      Math.max(
        1,
        Math.round(
          durationSeconds / 60
        )
      );

    console.log(
      `Route result: ${distanceKm} km / ${durationMinutes} min`
    );

    return {
      distanceKm,
      durationMinutes,
      distanceMeters,
      durationSeconds,
      source: "OSRM",
    };
  } catch (error) {
    console.error(
      "OSRM routing failed:",
      error
    );

    return null;
  }
}

// -----------------------------------------------------
// Calculate route for a sequence of places
// -----------------------------------------------------

export type PlaceRoute = {
  place: string;
  coordinates?: Coordinates;
  travelFromPrevious?: RouteResult | null;
};

export async function calculatePlaceRoutes(
  places: string[],
  destination: string
): Promise<PlaceRoute[]> {
  const results: PlaceRoute[] = [];

  let previousCoordinates:
    | Coordinates
    | null = null;

  for (const place of places) {
    const coordinates =
      await geocodePlace(
        place,
        destination
      );

    let travelFromPrevious:
      | RouteResult
      | null = null;

    if (
      coordinates &&
      previousCoordinates
    ) {
      travelFromPrevious =
        await getDrivingRoute(
          previousCoordinates,
          coordinates
        );
    }

    results.push({
      place,
      coordinates:
        coordinates || undefined,
      travelFromPrevious,
    });

    if (coordinates) {
      previousCoordinates =
        coordinates;
    }
  }

  return results;
}