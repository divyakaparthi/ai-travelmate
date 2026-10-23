// ============================================================
// AI TRAVELMATE - FRONTEND API
// File: apps/web/src/api.ts
// ============================================================

export const API_BASE_URL = "http://localhost:5000";

// Compatibility alias
export const API_URL = API_BASE_URL;

// ============================================================
// GENERIC HELPERS
// ============================================================

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return (
    typeof value === "object" &&
    value !== null
  );
}

export async function handleResponse<T>(
  response: Response
): Promise<T> {
  const text = await response.text();

  let data: unknown = null;

  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    if (
      isRecord(data) &&
      typeof data.message === "string"
    ) {
      throw new Error(data.message);
    }

    if (
      isRecord(data) &&
      typeof data.error === "string"
    ) {
      throw new Error(data.error);
    }

    if (
      isRecord(data) &&
      typeof data.details === "string"
    ) {
      throw new Error(data.details);
    }

    if (
      typeof data === "string" &&
      data.trim()
    ) {
      throw new Error(data);
    }

    throw new Error(
      `Request failed with status ${response.status}.`
    );
  }

  return data as T;
}

// ============================================================
// AUTH HELPERS
// ============================================================

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userEmail");
}

function authHeaders(): Record<string, string> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function requireToken(): string {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Authorization token is required."
    );
  }

  return token;
}

// ============================================================
// USER TYPES
// ============================================================

export type User = {
  id: string;
  email: string;
  createdAt?: string;
};

export type AuthResponse = {
  message?: string;
  token?: string;
  user?: User;
};

// ============================================================
// LOGIN / REGISTER
// ============================================================

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
};

// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------

export async function login(
  input: LoginInput
): Promise<AuthResponse> {
  const email =
    input.email.trim().toLowerCase();

  const password = input.password;

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data =
    await handleResponse<AuthResponse>(
      response
    );

  if (data.token) {
    localStorage.setItem(
      "token",
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "userEmail",
      data.user.email
    );
  } else {
    localStorage.setItem(
      "userEmail",
      email
    );
  }

  return data;
}

// ------------------------------------------------------------
// REGISTER
// ------------------------------------------------------------

export async function register(
  input: RegisterInput
): Promise<AuthResponse> {
  const email =
    input.email.trim().toLowerCase();

  const password = input.password;

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data =
    await handleResponse<AuthResponse>(
      response
    );

  if (data.token) {
    localStorage.setItem(
      "token",
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "userEmail",
      data.user.email
    );
  }

  return data;
}

// ============================================================
// TRIP TYPES
// ============================================================

export type Trip = {
  id: string;

  destination: string;

  startLocation?: string | null;

  startDate: string;

  endDate: string;

  budget: number;

  travelers?: number | null;

  preferences?: string | null;

  interests?: string | null;

  createdAt: string;

  userId?: string;
};

export type CreateTripInput = {
  destination: string;

  startLocation?: string;

  startDate: string;

  endDate: string;

  budget: number;

  travelers?: number;

  preferences?: string;

  interests?: string;
};

export type CreateTripResponse = {
  message?: string;

  trip?: Trip;
};

// ============================================================
// CREATE TRIP
// ============================================================

export async function createTrip(
  input: CreateTripInput
): Promise<CreateTripResponse> {
  requireToken();

  const preferences =
    input.preferences ??
    input.interests ??
    "";

  const body = {
    destination:
      input.destination.trim(),

    startLocation:
      input.startLocation?.trim() || "",

    startDate:
      input.startDate,

    endDate:
      input.endDate,

    budget:
      Number(input.budget),

    travelers:
      input.travelers,

    preferences,
  };

  const response = await fetch(
    `${API_BASE_URL}/api/trips`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  // { trip: {...} }
  if (
    isRecord(data) &&
    isRecord(data.trip)
  ) {
    return {
      message:
        typeof data.message === "string"
          ? data.message
          : undefined,

      trip:
        data.trip as unknown as Trip,
    };
  }

  // Direct trip object
  if (
    isRecord(data) &&
    typeof data.id === "string"
  ) {
    return {
      trip:
        data as unknown as Trip,
    };
  }

  throw new Error(
    "Trip was created but the server did not return trip information."
  );
}

// ============================================================
// GET ALL TRIPS
// ============================================================

export async function getTrips(): Promise<Trip[]> {
  requireToken();

  const response = await fetch(
    `${API_BASE_URL}/api/trips`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  if (
    isRecord(data) &&
    Array.isArray(data.trips)
  ) {
    return data.trips as Trip[];
  }

  if (Array.isArray(data)) {
    return data as Trip[];
  }

  return [];
}

// ============================================================
// GET SINGLE TRIP
// ============================================================

export async function getTrip(
  id: string
): Promise<Trip> {
  requireToken();

  if (
    !id ||
    id === "undefined" ||
    id === "null"
  ) {
    throw new Error(
      "Trip ID is missing or invalid."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/trips/${encodeURIComponent(
      id
    )}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  if (
    isRecord(data) &&
    isRecord(data.trip)
  ) {
    return data.trip as unknown as Trip;
  }

  if (
    isRecord(data) &&
    typeof data.id === "string"
  ) {
    return data as unknown as Trip;
  }

  throw new Error(
    "Trip not found."
  );
}

// ============================================================
// ITINERARY TYPES
// ============================================================

export type TravelRoute = {
  distanceKm: number;

  durationMinutes: number;

  distanceMeters: number;

  durationSeconds: number;

  source?: "OSRM" | string;
};

export type ItineraryRoute = {
  name?: string;

  place?: string;

  coordinates?: {
    latitude: number;
    longitude: number;
    displayName?: string;
  };

  travelFromPrevious?:
    | TravelRoute
    | null;
};

export type ItineraryDay = {
  day: number;

  date: string;

  morning: string;

  afternoon: string;

  evening: string;

  places: string[];

  food: string;

  estimatedCost: number;

  // Real routing information
  routes?: ItineraryRoute[];
};

export type EstimatedExpenses = {
  transport: number;

  food: number;

  activities: number;

  accommodation: number;

  total: number;
};

export type Itinerary = {
  destination: string;

  startDate: string;

  endDate: string;

  budget: number;

  days: ItineraryDay[];

  packingChecklist: string[];

  estimatedExpenses: EstimatedExpenses;
};

export type GenerateItineraryInput = {
  startLocation?: string;

  destination: string;

  startDate: string;

  endDate: string;

  budget: number;

  travelers?: number;

  preferences?: string;

  interests?: string;
};

export type SaveItineraryInput = {
  tripId: string;

  itinerary: Itinerary;
};

// ============================================================
// GENERATE AI ITINERARY
// ============================================================

export async function generateItinerary(
  input: GenerateItineraryInput
): Promise<Itinerary> {
  requireToken();

  const preferences =
    input.preferences ??
    input.interests ??
    "";

  const requestBody = {
    startLocation:
      input.startLocation ?? "",

    destination:
      input.destination,

    startDate:
      input.startDate,

    endDate:
      input.endDate,

    budget:
      Number(input.budget),

    travelers:
      input.travelers,

    preferences,
  };

  const endpoints = [
    `${API_BASE_URL}/api/ai/generate-itinerary`,
    `${API_BASE_URL}/api/ai/itinerary`,
  ];

  let lastResponse: Response | null =
    null;

  for (const endpoint of endpoints) {
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(
          requestBody
        ),
      }
    );

    lastResponse = response;

    // Try second known endpoint
    // if first does not exist.
    if (response.status === 404) {
      continue;
    }

    const data =
      await handleResponse<unknown>(
        response
      );

    // ------------------------------------------
    // { itinerary: {...} }
    // ------------------------------------------

    if (
      isRecord(data) &&
      isRecord(data.itinerary)
    ) {
      return normalizeItinerary(
        data.itinerary
      );
    }

    // ------------------------------------------
    // Direct itinerary
    // ------------------------------------------

    if (
      isRecord(data) &&
      Array.isArray(data.days)
    ) {
      return normalizeItinerary(
        data
      );
    }

    throw new Error(
      "The server returned an invalid itinerary."
    );
  }

  throw new Error(
    `Itinerary API was not found (${lastResponse?.status ?? 404}).`
  );
}

// ============================================================
// ITINERARY NORMALIZER
// ============================================================

function normalizeItinerary(
  value: unknown
): Itinerary {
  if (!isRecord(value)) {
    throw new Error(
      "Invalid itinerary data."
    );
  }

  const daysValue =
    Array.isArray(value.days)
      ? value.days
      : [];

  const days: ItineraryDay[] =
    daysValue.map(
      (
        dayValue,
        index
      ) => {
        const day =
          isRecord(dayValue)
            ? dayValue
            : {};

        return {
          day:
            typeof day.day === "number"
              ? day.day
              : index + 1,

          date:
            typeof day.date === "string"
              ? day.date
              : "",

          morning:
            typeof day.morning === "string"
              ? day.morning
              : "",

          afternoon:
            typeof day.afternoon === "string"
              ? day.afternoon
              : "",

          evening:
            typeof day.evening === "string"
              ? day.evening
              : "",

          places:
            Array.isArray(day.places)
              ? day.places.filter(
                  (
                    place
                  ): place is string =>
                    typeof place ===
                    "string"
                )
              : [],

          food:
            typeof day.food === "string"
              ? day.food
              : "",

          estimatedCost:
            typeof day.estimatedCost ===
            "number"
              ? day.estimatedCost
              : Number(
                  day.estimatedCost ?? 0
                ),

          routes:
            Array.isArray(day.routes)
              ? day.routes as ItineraryRoute[]
              : undefined,
        };
      }
    );

  const expenses =
    isRecord(
      value.estimatedExpenses
    )
      ? value.estimatedExpenses
      : {};

  return {
    destination:
      typeof value.destination ===
      "string"
        ? value.destination
        : "",

    startDate:
      typeof value.startDate ===
      "string"
        ? value.startDate
        : "",

    endDate:
      typeof value.endDate ===
      "string"
        ? value.endDate
        : "",

    budget:
      typeof value.budget ===
      "number"
        ? value.budget
        : Number(
            value.budget ?? 0
          ),

    days,

    packingChecklist:
      Array.isArray(
        value.packingChecklist
      )
        ? value.packingChecklist.filter(
            (
              item
            ): item is string =>
              typeof item ===
              "string"
          )
        : [],

    estimatedExpenses: {
      transport:
        typeof expenses.transport ===
        "number"
          ? expenses.transport
          : Number(
              expenses.transport ?? 0
            ),

      food:
        typeof expenses.food ===
        "number"
          ? expenses.food
          : Number(
              expenses.food ?? 0
            ),

      activities:
        typeof expenses.activities ===
        "number"
          ? expenses.activities
          : Number(
              expenses.activities ?? 0
            ),

      accommodation:
        typeof expenses.accommodation ===
        "number"
          ? expenses.accommodation
          : Number(
              expenses.accommodation ?? 0
            ),

      total:
        typeof expenses.total ===
        "number"
          ? expenses.total
          : Number(
              expenses.total ?? 0
            ),
    },
  };
}

// ============================================================
// GET SAVED ITINERARY
// ============================================================

export async function getSavedItinerary(
  tripId: string
): Promise<Itinerary | null> {
  requireToken();

  if (!tripId) {
    throw new Error(
      "Trip ID is required."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/itinerary/${encodeURIComponent(
      tripId
    )}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  if (response.status === 404) {
    return null;
  }

  const data =
    await handleResponse<unknown>(
      response
    );

  // Backend:
  // {
  //   itinerary: {
  //     data: {...}
  //   }
  // }

  if (
    isRecord(data) &&
    isRecord(data.itinerary)
  ) {
    const saved =
      data.itinerary;

    if (
      "data" in saved
    ) {
      return normalizeItinerary(
        saved.data
      );
    }

    return normalizeItinerary(
      saved
    );
  }

  if (
    isRecord(data) &&
    Array.isArray(data.days)
  ) {
    return normalizeItinerary(
      data
    );
  }

  return null;
}

// ============================================================
// SAVE ITINERARY
// ============================================================

export async function saveItinerary(
  input: SaveItineraryInput
): Promise<Itinerary> {
  requireToken();

  const response = await fetch(
    `${API_BASE_URL}/api/itinerary`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        tripId: input.tripId,
        itinerary: input.itinerary,
      }),
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  if (
    isRecord(data) &&
    isRecord(data.itinerary)
  ) {
    const saved =
      data.itinerary;

    if ("data" in saved) {
      return normalizeItinerary(
        saved.data
      );
    }

    return normalizeItinerary(
      saved
    );
  }

  if (
    isRecord(data) &&
    Array.isArray(data.days)
  ) {
    return normalizeItinerary(
      data
    );
  }

  throw new Error(
    "The server did not return the saved itinerary."
  );
}

// ============================================================
// PLACE TYPES
// ============================================================

export type Place = {
  id: string;

  name: string;

  destination: string;

  category: string;

  description: string;

  location: string;

  estimatedCost: number | string;

  imageUrl?: string | null;

  bestTimeToVisit?: string;

  historicalInformation?: string;

  nearbyAttractions?: string;

  thingsToDo?: string;

  [key: string]: unknown;
};

// ============================================================
// GET PLACES
// ============================================================

export async function getPlaces(
  destination?: string
): Promise<Place[]> {
  const url = new URL(
    `${API_BASE_URL}/api/places`
  );

  if (destination?.trim()) {
    url.searchParams.set(
      "destination",
      destination.trim()
    );
  }

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  if (
    isRecord(data) &&
    Array.isArray(data.places)
  ) {
    return data.places as Place[];
  }

  if (Array.isArray(data)) {
    return data as Place[];
  }

  return [];
}

// ============================================================
// HOTEL TYPES
// ============================================================

export type Hotel = {
  id: string;

  name: string;

  destination?: string;

  category?: string;

  location?: string;

  address?: string;

  description?: string;

  price?: number | string;

  pricePerNight?: number | string;

  priceRange?: string;

  rating?: number | string;

  imageUrl?: string | null;

  [key: string]: unknown;
};

// ============================================================
// GET HOTELS
// ============================================================

export async function getHotels(
  destination: string
): Promise<Hotel[]> {
  const params =
    new URLSearchParams();

  if (destination.trim()) {
    params.set(
      "destination",
      destination.trim()
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/hotels?${params.toString()}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  if (
    isRecord(data) &&
    Array.isArray(data.hotels)
  ) {
    return data.hotels as Hotel[];
  }

  if (Array.isArray(data)) {
    return data as Hotel[];
  }

  return [];
}

// ============================================================
// GET HOSTELS
// ============================================================

export async function getHostels(
  destination: string
): Promise<Hotel[]> {
  const hotels =
    await getHotels(destination);

  return hotels.filter(
    (hotel) =>
      typeof hotel.category ===
        "string" &&
      hotel.category
        .toLowerCase()
        .includes("hostel")
  );
}

// ============================================================
// COMPATIBILITY ALIASES
// ============================================================

// Some older components may use
// singular function names.

export async function getHotel(
  destination: string
): Promise<Hotel[]> {
  return getHotels(destination);
}

export async function getHostel(
  destination: string
): Promise<Hotel[]> {
  return getHostels(destination);
}

// ============================================================
// RESTAURANT TYPES
// ============================================================

export type Restaurant = {
  id: string;

  name: string;

  destination?: string;

  location?: string;

  address?: string;

  cuisine?: string;

  description?: string;

  averageCost?: number | string;

  price?: number | string;

  priceRange?: string;

  rating?: number | string;

  imageUrl?: string | null;

  [key: string]: unknown;
};

// ============================================================
// GET RESTAURANTS
// ============================================================

export async function getRestaurants(
  destination: string
): Promise<Restaurant[]> {
  const url = new URL(
    `${API_BASE_URL}/api/restaurants`
  );

  if (destination.trim()) {
    url.searchParams.set(
      "destination",
      destination.trim()
    );
  }

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  if (
    isRecord(data) &&
    Array.isArray(
      data.restaurants
    )
  ) {
    return data.restaurants as Restaurant[];
  }

  if (Array.isArray(data)) {
    return data as Restaurant[];
  }

  return [];
}

// ============================================================
// COMPATIBILITY ALIAS
// ============================================================

export async function getRestaurant(
  destination: string
): Promise<Restaurant[]> {
  return getRestaurants(destination);
}

// ============================================================
// PHOTO RECOGNITION
// ============================================================

export type RecognitionResult = {
  placeName: string;

  confidence: number;

  description: string;

  location: string;

  historicalInformation: string;

  thingsToDo: string[];

  bestTimeToVisit: string;

  estimatedCost: number | string;

  nearbyAttractions: string[];
};

// ============================================================
// FILE -> BASE64
// ============================================================

function fileToBase64(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result ===
          "string"
        ) {
          resolve(
            reader.result
          );
        } else {
          reject(
            new Error(
              "Unable to read the selected image."
            )
          );
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Unable to read the selected image."
          )
        );
      };

      reader.readAsDataURL(file);
    }
  );
}

// ============================================================
// RECOGNIZE PHOTO
// ============================================================

export async function recognizePhoto(
  file: File,
  destination?: string
): Promise<RecognitionResult> {
  if (!file) {
    throw new Error(
      "Please select an image."
    );
  }

  const image =
    await fileToBase64(file);

  const token =
    getToken();

  const headers: Record<
    string,
    string
  > = {
    "Content-Type":
      "application/json",
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/photo-recognition`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        image,

        destination:
          destination?.trim() || "",
      }),
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  // { result: {...} }

  if (
    isRecord(data) &&
    isRecord(data.result)
  ) {
    return data.result as unknown as RecognitionResult;
  }

  // Direct result

  if (
    isRecord(data) &&
    typeof data.placeName ===
      "string"
  ) {
    return data as unknown as RecognitionResult;
  }

  throw new Error(
    "The server returned an invalid photo recognition result."
  );
}

// ============================================================
// CHATBOT
// ============================================================

export type ChatResponse = {
  reply: string;
};

export async function chatWithAI(
  message: string,
  trip?: Trip | null
): Promise<string> {
  const cleanMessage =
    message.trim();

  if (!cleanMessage) {
    throw new Error(
      "Please enter a message."
    );
  }

  const token =
    getToken();

  const headers: Record<
    string,
    string
  > = {
    "Content-Type":
      "application/json",
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/chat`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        message:
          cleanMessage,

        trip,
      }),
    }
  );

  const data =
    await handleResponse<unknown>(
      response
    );

  if (
    isRecord(data) &&
    typeof data.reply ===
      "string"
  ) {
    return data.reply;
  }

  if (
    isRecord(data) &&
    typeof data.message ===
      "string"
  ) {
    return data.message;
  }

  if (
    isRecord(data) &&
    typeof data.response ===
      "string"
  ) {
    return data.response;
  }

  if (
    isRecord(data) &&
    typeof data.answer ===
      "string"
  ) {
    return data.answer;
  }

  throw new Error(
    "The server returned an invalid chatbot response."
  );
}

// ============================================================
// HEALTH CHECK
// ============================================================

export type HealthResponse = {
  status: string;

  service?: string;
};

export async function healthCheck(): Promise<HealthResponse> {
  const response = await fetch(
    `${API_BASE_URL}/health`,
    {
      method: "GET",
    }
  );

  return handleResponse<HealthResponse>(
    response
  );
}