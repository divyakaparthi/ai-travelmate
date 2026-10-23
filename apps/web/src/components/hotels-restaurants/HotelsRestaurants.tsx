import { useEffect, useState } from "react";

type Hotel = {
  id?: string;
  name: string;
  destination?: string;
  location?: string;
  address?: string;
  price?: number;
  pricePerNight?: number;
  rating?: number;
  description?: string;
  imageUrl?: string;
};

type Restaurant = {
  id?: string;
  name: string;
  destination?: string;
  location?: string;
  address?: string;
  cuisine?: string;
  rating?: number;
  priceRange?: string;
  description?: string;
  imageUrl?: string;
};

type HotelsRestaurantsProps = {
  destination: string;
};

const API_URL = "http://localhost:5000";

export default function HotelsRestaurants({
  destination,
}: HotelsRestaurantsProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [loadingHotels, setLoadingHotels] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] =
    useState(true);

  const [hotelError, setHotelError] = useState("");
  const [restaurantError, setRestaurantError] =
    useState("");

  useEffect(() => {
    if (!destination.trim()) {
      setHotels([]);
      setRestaurants([]);
      setLoadingHotels(false);
      setLoadingRestaurants(false);
      return;
    }

    const cleanDestination = destination.trim();

    async function loadHotels() {
      try {
        setLoadingHotels(true);
        setHotelError("");

        const response = await fetch(
          `${API_URL}/api/hotels?destination=${encodeURIComponent(
            cleanDestination
          )}`
        );

        if (!response.ok) {
          throw new Error(
            `Hotels request failed (${response.status})`
          );
        }

        const data = await response.json();

        console.log(
          "HOTELS RESPONSE:",
          data
        );

        const hotelList =
          Array.isArray(data)
            ? data
            : Array.isArray(data.hotels)
            ? data.hotels
            : Array.isArray(data.data)
            ? data.data
            : [];

        setHotels(hotelList);
      } catch (error) {
        console.error(
          "Failed to load hotels:",
          error
        );

        setHotels([]);

        setHotelError(
          error instanceof Error
            ? error.message
            : "Failed to load hotels."
        );
      } finally {
        setLoadingHotels(false);
      }
    }

    async function loadRestaurants() {
      try {
        setLoadingRestaurants(true);
        setRestaurantError("");

        const response = await fetch(
          `${API_URL}/api/restaurants?destination=${encodeURIComponent(
            cleanDestination
          )}`
        );

        if (!response.ok) {
          throw new Error(
            `Restaurants request failed (${response.status})`
          );
        }

        const data = await response.json();

        console.log(
          "RESTAURANTS RESPONSE:",
          data
        );

        const restaurantList =
          Array.isArray(data)
            ? data
            : Array.isArray(data.restaurants)
            ? data.restaurants
            : Array.isArray(data.data)
            ? data.data
            : [];

        setRestaurants(restaurantList);
      } catch (error) {
        console.error(
          "Failed to load restaurants:",
          error
        );

        setRestaurants([]);

        setRestaurantError(
          error instanceof Error
            ? error.message
            : "Failed to load restaurants."
        );
      } finally {
        setLoadingRestaurants(false);
      }
    }

    void loadHotels();
    void loadRestaurants();
  }, [destination]);

  return (
    <section style={styles.wrapper}>
      {/* =====================================================
          HOTELS
      ===================================================== */}

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.label}>
              STAY
            </p>

            <h2 style={styles.title}>
              🏨 Recommended Hotels
            </h2>

            <p style={styles.subtitle}>
              Hotels available in{" "}
              <strong>{destination}</strong>
            </p>
          </div>
        </div>

        {loadingHotels && (
          <div style={styles.message}>
            <span style={styles.spinner}>
              ⏳
            </span>

            Loading hotels for{" "}
            <strong>{destination}</strong>...
          </div>
        )}

        {!loadingHotels &&
          hotelError && (
            <div style={styles.error}>
              ⚠️ {hotelError}
            </div>
          )}

        {!loadingHotels &&
          !hotelError &&
          hotels.length === 0 && (
            <div style={styles.message}>
              No hotels found for{" "}
              <strong>{destination}</strong>.
            </div>
          )}

        {!loadingHotels &&
          hotels.length > 0 && (
            <div style={styles.grid}>
              {hotels.map((hotel, index) => (
                <HotelCard
                  key={
                    hotel.id ??
                    `${hotel.name}-${index}`
                  }
                  hotel={hotel}
                />
              ))}
            </div>
          )}
      </div>

      {/* =====================================================
          RESTAURANTS
      ===================================================== */}

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.label}>
              FOOD
            </p>

            <h2 style={styles.title}>
              🍴 Recommended Restaurants
            </h2>

            <p style={styles.subtitle}>
              Restaurants available in{" "}
              <strong>{destination}</strong>
            </p>
          </div>
        </div>

        {loadingRestaurants && (
          <div style={styles.message}>
            <span style={styles.spinner}>
              ⏳
            </span>

            Loading restaurants for{" "}
            <strong>{destination}</strong>...
          </div>
        )}

        {!loadingRestaurants &&
          restaurantError && (
            <div style={styles.error}>
              ⚠️ {restaurantError}
            </div>
          )}

        {!loadingRestaurants &&
          !restaurantError &&
          restaurants.length === 0 && (
            <div style={styles.message}>
              No restaurants found for{" "}
              <strong>{destination}</strong>.
            </div>
          )}

        {!loadingRestaurants &&
          restaurants.length > 0 && (
            <div style={styles.grid}>
              {restaurants.map(
                (restaurant, index) => (
                  <RestaurantCard
                    key={
                      restaurant.id ??
                      `${restaurant.name}-${index}`
                    }
                    restaurant={restaurant}
                  />
                )
              )}
            </div>
          )}
      </div>
    </section>
  );
}

/* =========================================================
   HOTEL CARD
========================================================= */

function HotelCard({
  hotel,
}: {
  hotel: Hotel;
}) {
  const price =
    hotel.pricePerNight ??
    hotel.price;

  return (
    <article style={styles.card}>
      {hotel.imageUrl && (
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          style={styles.image}
        />
      )}

      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>
          🏨 {hotel.name}
        </h3>

        {(hotel.location ||
          hotel.address) && (
          <p style={styles.location}>
            📍{" "}
            {hotel.location ??
              hotel.address}
          </p>
        )}

        {hotel.rating !== undefined && (
          <p style={styles.rating}>
            ⭐ {hotel.rating}
          </p>
        )}

        {price !== undefined && (
          <p style={styles.price}>
            ₹
            {Number(price).toLocaleString(
              "en-IN"
            )}
            <span style={styles.perNight}>
              {" "}
              / night
            </span>
          </p>
        )}

        {hotel.description && (
          <p style={styles.description}>
            {hotel.description}
          </p>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   RESTAURANT CARD
========================================================= */

function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  return (
    <article style={styles.card}>
      {restaurant.imageUrl && (
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          style={styles.image}
        />
      )}

      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>
          🍴 {restaurant.name}
        </h3>

        {(restaurant.location ||
          restaurant.address) && (
          <p style={styles.location}>
            📍{" "}
            {restaurant.location ??
              restaurant.address}
          </p>
        )}

        {restaurant.cuisine && (
          <p style={styles.cuisine}>
            🍽️ {restaurant.cuisine}
          </p>
        )}

        {restaurant.rating !== undefined && (
          <p style={styles.rating}>
            ⭐ {restaurant.rating}
          </p>
        )}

        {restaurant.priceRange && (
          <p style={styles.priceRange}>
            💰 {restaurant.priceRange}
          </p>
        )}

        {restaurant.description && (
          <p style={styles.description}>
            {restaurant.description}
          </p>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles: Record<
  string,
  React.CSSProperties
> = {
  wrapper: {
    width: "100%",
  },

  section: {
    marginBottom: "25px",
    padding: "30px",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  sectionHeader: {
    marginBottom: "22px",
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
    fontSize: "25px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  card: {
    overflow: "hidden",
    borderRadius: "17px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },

  image: {
    width: "100%",
    height: "170px",
    objectFit: "cover",
    display: "block",
  },

  cardContent: {
    padding: "20px",
  },

  cardTitle: {
    margin: "0 0 10px",
    color: "#111827",
    fontSize: "18px",
  },

  location: {
    margin: "0 0 8px",
    color: "#64748b",
    fontSize: "14px",
  },

  rating: {
    margin: "8px 0",
    color: "#b45309",
    fontWeight: 700,
  },

  price: {
    margin: "10px 0",
    color: "#15803d",
    fontSize: "17px",
    fontWeight: 800,
  },

  perNight: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 500,
  },

  cuisine: {
    margin: "8px 0",
    color: "#4f46e5",
    fontWeight: 600,
  },

  priceRange: {
    margin: "8px 0",
    color: "#15803d",
    fontWeight: 700,
  },

  description: {
    margin: "10px 0 0",
    color: "#64748b",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  message: {
    padding: "22px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    textAlign: "center",
  },

  error: {
    padding: "18px",
    borderRadius: "14px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
  },

  spinner: {
    marginRight: "7px",
  },
};