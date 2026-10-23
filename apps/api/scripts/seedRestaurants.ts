import "dotenv/config";
import db from "../src/prisma/db";

type RestaurantSeed = {
  name: string;
  destination: string;
  cuisine: string;
  description: string;
  location: string;
  priceRange: string;
  rating: number;
  specialties: string;
  imageUrl?: string | null;
};


const restaurants: RestaurantSeed[] = [
  // =========================================================
  // MUMBAI
  // =========================================================

  {
    name: "Trishna",
    destination: "Mumbai",
    cuisine: "Seafood",
    description:
      "A popular South Mumbai restaurant known for coastal seafood and traditional Indian flavors.",
    location: "Kala Ghoda, Fort, Mumbai, Maharashtra",
    priceRange: "₹₹₹",
    rating: 4.5,
    specialties:
      "Butter Garlic Crab, Tandoori Lobster, Garlic Prawns",
    imageUrl: null,
  },
  {
    name: "Britannia & Co.",
    destination: "Mumbai",
    cuisine: "Parsi",
    description:
      "A historic Parsi-Irani restaurant serving traditional dishes in a classic Mumbai setting.",
    location: "Ballard Estate, Fort, Mumbai, Maharashtra",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Berry Pulao, Salli Boti, Dhansak",
    imageUrl: null,
  },
  {
    name: "Masala Library",
    destination: "Mumbai",
    cuisine: "Modern Indian",
    description:
      "An upscale restaurant offering creative interpretations of Indian cuisine.",
    location: "Bandra Kurla Complex, Mumbai, Maharashtra",
    priceRange: "₹₹₹₹",
    rating: 4.5,
    specialties:
      "Modern Indian Tasting Menu, Kebabs, Curries",
    imageUrl: null,
  },

  // =========================================================
  // DELHI
  // =========================================================

  {
    name: "Indian Accent",
    destination: "Delhi",
    cuisine: "Modern Indian",
    description:
      "A contemporary restaurant known for creative interpretations of Indian cuisine.",
    location: "Lodhi Road, New Delhi, Delhi",
    priceRange: "₹₹₹₹",
    rating: 4.7,
    specialties:
      "Tasting Menu, Contemporary Indian Dishes, Kebabs",
    imageUrl: null,
  },
  {
    name: "Karim's",
    destination: "Delhi",
    cuisine: "Mughlai",
    description:
      "A historic Old Delhi restaurant famous for traditional Mughlai cuisine.",
    location: "Jama Masjid, Old Delhi, Delhi",
    priceRange: "₹₹",
    rating: 4.2,
    specialties:
      "Mutton Korma, Seekh Kebab, Chicken Jahangiri",
    imageUrl: null,
  },
  {
    name: "Bukhara",
    destination: "Delhi",
    cuisine: "North Indian",
    description:
      "A well-known restaurant specializing in traditional North Indian tandoori dishes.",
    location: "ITC Maurya, Sardar Patel Marg, New Delhi",
    priceRange: "₹₹₹₹",
    rating: 4.6,
    specialties:
      "Dal Bukhara, Tandoori Chicken, Kebabs",
    imageUrl: null,
  },

  // =========================================================
  // HYDERABAD
  // =========================================================

  {
    name: "Paradise Restaurant",
    destination: "Hyderabad",
    cuisine: "Hyderabadi",
    description:
      "A popular restaurant serving traditional Hyderabadi cuisine.",
    location: "Paradise Circle, Secunderabad, Hyderabad",
    priceRange: "₹₹",
    rating: 4.2,
    specialties:
      "Hyderabadi Biryani, Haleem, Kebabs",
    imageUrl: null,
  },
  {
    name: "Shah Ghouse",
    destination: "Hyderabad",
    cuisine: "Hyderabadi",
    description:
      "A popular local restaurant known for biryani and traditional Hyderabadi dishes.",
    location: "Tolichowki, Hyderabad, Telangana",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Mutton Biryani, Chicken Biryani, Haleem",
    imageUrl: null,
  },
  {
    name: "Jewel of Nizam",
    destination: "Hyderabad",
    cuisine: "Indian",
    description:
      "An elegant restaurant offering Indian and Hyderabadi cuisine.",
    location: "Golkonda Resort, Hyderabad, Telangana",
    priceRange: "₹₹₹₹",
    rating: 4.5,
    specialties:
      "Hyderabadi Cuisine, Kebabs, Biryani",
    imageUrl: null,
  },

  // =========================================================
  // GOA
  // =========================================================

  {
    name: "Gunpowder",
    destination: "Goa",
    cuisine: "South Indian",
    description:
      "A popular restaurant serving regional South Indian cuisine in a relaxed setting.",
    location: "Assagao, North Goa, Goa",
    priceRange: "₹₹₹",
    rating: 4.5,
    specialties:
      "Kerala Cuisine, Andhra Cuisine, Seafood",
    imageUrl: null,
  },
  {
    name: "Mum's Kitchen",
    destination: "Goa",
    cuisine: "Goan",
    description:
      "A restaurant focused on traditional Goan home-style recipes.",
    location: "Miramar, Panaji, Goa",
    priceRange: "₹₹₹",
    rating: 4.4,
    specialties:
      "Goan Fish Curry, Pork Vindaloo, Sorpotel",
    imageUrl: null,
  },
  {
    name: "Thalassa",
    destination: "Goa",
    cuisine: "Greek",
    description:
      "A scenic restaurant offering Greek and Mediterranean cuisine.",
    location: "Vagator, North Goa, Goa",
    priceRange: "₹₹₹",
    rating: 4.3,
    specialties:
      "Greek Salad, Seafood, Grilled Meats",
    imageUrl: null,
  },

  // =========================================================
  // JAIPUR
  // =========================================================

  {
    name: "1135 AD",
    destination: "Jaipur",
    cuisine: "Rajasthani",
    description:
      "An elegant restaurant near Amber Fort serving traditional Rajasthani cuisine.",
    location: "Amber Fort, Amer, Jaipur, Rajasthan",
    priceRange: "₹₹₹₹",
    rating: 4.5,
    specialties:
      "Rajasthani Thali, Laal Maas, Dal Baati Churma",
    imageUrl: null,
  },
  {
    name: "Chokhi Dhani",
    destination: "Jaipur",
    cuisine: "Rajasthani",
    description:
      "A traditional Rajasthani village-themed destination offering local food and cultural experiences.",
    location: "Tonk Road, Jaipur, Rajasthan",
    priceRange: "₹₹₹",
    rating: 4.2,
    specialties:
      "Rajasthani Thali, Dal Baati Churma, Gatte Ki Sabzi",
    imageUrl: null,
  },
  {
    name: "Lassiwala",
    destination: "Jaipur",
    cuisine: "Indian",
    description:
      "A famous Jaipur stop known for traditional thick lassi.",
    location: "MI Road, Jaipur, Rajasthan",
    priceRange: "₹",
    rating: 4.4,
    specialties:
      "Lassi, Sweet Lassi, Traditional Indian Drinks",
    imageUrl: null,
  },

  // =========================================================
  // AGRA
  // =========================================================

  {
    name: "Pinch of Spice",
    destination: "Agra",
    cuisine: "North Indian",
    description:
      "A popular restaurant offering North Indian and Mughlai cuisine.",
    location: "Fatehabad Road, Agra, Uttar Pradesh",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Butter Chicken, Kebabs, Biryani",
    imageUrl: null,
  },
  {
    name: "Peshawri",
    destination: "Agra",
    cuisine: "North Indian",
    description:
      "An upscale restaurant specializing in traditional North Indian tandoori cuisine.",
    location: "ITC Mughal, Taj Ganj, Agra",
    priceRange: "₹₹₹₹",
    rating: 4.5,
    specialties:
      "Dal Bukhara, Tandoori Chicken, Kebabs",
    imageUrl: null,
  },
  {
    name: "Esphahan",
    destination: "Agra",
    cuisine: "Indian",
    description:
      "An elegant restaurant offering traditional Indian cuisine.",
    location: "The Oberoi Amarvilas, Agra",
    priceRange: "₹₹₹₹",
    rating: 4.5,
    specialties:
      "Mughlai Cuisine, Kebabs, Indian Curries",
    imageUrl: null,
  },

  // =========================================================
  // BANGALORE
  // =========================================================

  {
    name: "MTR",
    destination: "Bangalore",
    cuisine: "South Indian",
    description:
      "A historic Bangalore restaurant famous for traditional South Indian breakfast and meals.",
    location: "Lalbagh Road, Bengaluru, Karnataka",
    priceRange: "₹₹",
    rating: 4.4,
    specialties:
      "Masala Dosa, Rava Idli, Bisibele Bath",
    imageUrl: null,
  },
  {
    name: "Vidyarthi Bhavan",
    destination: "Bangalore",
    cuisine: "South Indian",
    description:
      "A legendary vegetarian restaurant known for crispy dosas and traditional South Indian food.",
    location: "Basavanagudi, Bengaluru, Karnataka",
    priceRange: "₹",
    rating: 4.5,
    specialties:
      "Masala Dosa, Vada, Coffee",
    imageUrl: null,
  },
  {
    name: "Karavalli",
    destination: "Bangalore",
    cuisine: "Coastal Indian",
    description:
      "An acclaimed restaurant specializing in coastal cuisine from southern India.",
    location: "Residency Road, Bengaluru, Karnataka",
    priceRange: "₹₹₹₹",
    rating: 4.5,
    specialties:
      "Mangalorean Seafood, Coastal Curries, Appam",
    imageUrl: null,
  },

  // =========================================================
  // CHENNAI
  // =========================================================

  {
    name: "Murugan Idli Shop",
    destination: "Chennai",
    cuisine: "South Indian",
    description:
      "A popular vegetarian restaurant known for traditional Tamil Nadu breakfast dishes.",
    location: "T. Nagar, Chennai, Tamil Nadu",
    priceRange: "₹",
    rating: 4.3,
    specialties:
      "Idli, Dosa, Pongal, Vada",
    imageUrl: null,
  },
  {
    name: "Dakshin",
    destination: "Chennai",
    cuisine: "South Indian",
    description:
      "An elegant restaurant serving regional South Indian cuisine.",
    location: "ITC Grand Chola, Chennai, Tamil Nadu",
    priceRange: "₹₹₹₹",
    rating: 4.5,
    specialties:
      "Tamil Cuisine, Kerala Cuisine, Andhra Cuisine",
    imageUrl: null,
  },
  {
    name: "The Marina",
    destination: "Chennai",
    cuisine: "Seafood",
    description:
      "A restaurant offering South Indian seafood and coastal dishes.",
    location: "Mylapore, Chennai, Tamil Nadu",
    priceRange: "₹₹",
    rating: 4.2,
    specialties:
      "Fish Curry, Prawn Masala, Fried Fish",
    imageUrl: null,
  },

  // =========================================================
  // KOLKATA
  // =========================================================

  {
    name: "6 Ballygunge Place",
    destination: "Kolkata",
    cuisine: "Bengali",
    description:
      "A popular restaurant serving traditional Bengali home-style cuisine.",
    location: "Ballygunge, Kolkata, West Bengal",
    priceRange: "₹₹",
    rating: 4.4,
    specialties:
      "Bengali Thali, Fish Curry, Kosha Mangsho",
    imageUrl: null,
  },
  {
    name: "Peter Cat",
    destination: "Kolkata",
    cuisine: "Indian Continental",
    description:
      "A historic Kolkata restaurant famous for its classic dishes.",
    location: "Park Street, Kolkata, West Bengal",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Chelo Kebab, Sizzlers, Continental Cuisine",
    imageUrl: null,
  },
  {
    name: "Kosha Mangsho",
    destination: "Kolkata",
    cuisine: "Bengali",
    description:
      "A restaurant focused on traditional Bengali meat and seafood dishes.",
    location: "Salt Lake, Kolkata, West Bengal",
    priceRange: "₹₹",
    rating: 4.2,
    specialties:
      "Kosha Mangsho, Fish Curry, Bengali Thali",
    imageUrl: null,
  },

  // =========================================================
  // VARANASI
  // =========================================================

  {
    name: "Kashi Chat Bhandar",
    destination: "Varanasi",
    cuisine: "Indian Street Food",
    description:
      "A popular local food destination known for traditional Banarasi snacks.",
    location: "Godowlia, Varanasi, Uttar Pradesh",
    priceRange: "₹",
    rating: 4.3,
    specialties:
      "Tamatar Chaat, Aloo Chaat, Golgappa",
    imageUrl: null,
  },
  {
    name: "Deena Chaat Bhandar",
    destination: "Varanasi",
    cuisine: "Indian Street Food",
    description:
      "A local favorite offering traditional Varanasi street food.",
    location: "Dashashwamedh Road, Varanasi",
    priceRange: "₹",
    rating: 4.2,
    specialties:
      "Kachori Sabzi, Chaat, Lassi",
    imageUrl: null,
  },
  {
    name: "Baati Chokha",
    destination: "Varanasi",
    cuisine: "Bihari",
    description:
      "A traditional restaurant serving rustic North Indian and Bihari dishes.",
    location: "Sarnath Road, Varanasi, Uttar Pradesh",
    priceRange: "₹₹",
    rating: 4.4,
    specialties:
      "Litti Chokha, Dal Baati, Rural Indian Cuisine",
    imageUrl: null,
  },

  // =========================================================
  // KOCHI
  // =========================================================

  {
    name: "Kadaloram",
    destination: "Kochi",
    cuisine: "Kerala",
    description:
      "A coastal restaurant serving traditional Kerala seafood and local dishes.",
    location: "Fort Kochi, Kerala",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Kerala Fish Curry, Appam, Prawns",
    imageUrl: null,
  },
  {
    name: "Kashi Art Cafe",
    destination: "Kochi",
    cuisine: "Cafe",
    description:
      "A relaxed heritage cafe in Fort Kochi offering light meals and beverages.",
    location: "Fort Kochi, Kerala",
    priceRange: "₹₹",
    rating: 4.4,
    specialties:
      "Sandwiches, Salads, Coffee, Desserts",
    imageUrl: null,
  },
  {
    name: "Dal Roti",
    destination: "Kochi",
    cuisine: "North Indian",
    description:
      "A casual restaurant offering vegetarian North Indian comfort food.",
    location: "Fort Kochi, Kerala",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Dal, Roti, Thali, North Indian Curries",
    imageUrl: null,
  },

  // =========================================================
  // PUNE
  // =========================================================

  {
    name: "Vaishali",
    destination: "Pune",
    cuisine: "South Indian",
    description:
      "A famous Pune restaurant known for vegetarian South Indian dishes.",
    location: "FC Road, Pune, Maharashtra",
    priceRange: "₹₹",
    rating: 4.4,
    specialties:
      "Dosa, Idli, Uttapam, Filter Coffee",
    imageUrl: null,
  },
  {
    name: "Shabree",
    destination: "Pune",
    cuisine: "Maharashtrian",
    description:
      "A popular restaurant serving traditional Maharashtrian vegetarian food.",
    location: "Deccan Gymkhana, Pune, Maharashtra",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Maharashtrian Thali, Puran Poli, Bharli Vangi",
    imageUrl: null,
  },
  {
    name: "Cafe Goodluck",
    destination: "Pune",
    cuisine: "Indian",
    description:
      "A historic Pune cafe known for classic breakfast and casual meals.",
    location: "Deccan Gymkhana, Pune, Maharashtra",
    priceRange: "₹",
    rating: 4.2,
    specialties:
      "Bun Maska, Irani Chai, Omelette, Keema",
    imageUrl: null,
  },

  // =========================================================
  // RISHIKESH
  // =========================================================

  {
    name: "Chotiwala",
    destination: "Rishikesh",
    cuisine: "North Indian",
    description:
      "A popular vegetarian restaurant serving traditional North Indian food.",
    location: "Swarg Ashram, Rishikesh, Uttarakhand",
    priceRange: "₹₹",
    rating: 4.2,
    specialties:
      "Thali, Paneer Dishes, North Indian Curries",
    imageUrl: null,
  },
  {
    name: "Little Buddha Cafe",
    destination: "Rishikesh",
    cuisine: "Multi-Cuisine",
    description:
      "A riverside cafe offering vegetarian and international dishes.",
    location: "Laxman Jhula, Rishikesh, Uttarakhand",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Pasta, Pizza, Indian Food, Smoothies",
    imageUrl: null,
  },
  {
    name: "The Sitting Elephant",
    destination: "Rishikesh",
    cuisine: "Indian",
    description:
      "A rooftop restaurant offering Indian cuisine and scenic views.",
    location: "Tapovan, Rishikesh, Uttarakhand",
    priceRange: "₹₹",
    rating: 4.4,
    specialties:
      "Indian Curries, Thali, Snacks, Beverages",
    imageUrl: null,
  },

  // =========================================================
  // UDAIPUR
  // =========================================================

  {
    name: "Ambrai",
    destination: "Udaipur",
    cuisine: "Indian",
    description:
      "A scenic restaurant offering Indian cuisine with views of Lake Pichola.",
    location: "Amet Haveli, Udaipur, Rajasthan",
    priceRange: "₹₹₹",
    rating: 4.4,
    specialties:
      "Rajasthani Cuisine, Kebabs, Curries",
    imageUrl: null,
  },
  {
    name: "Natraj Dining Hall",
    destination: "Udaipur",
    cuisine: "Rajasthani",
    description:
      "A traditional restaurant known for vegetarian Rajasthani and Gujarati thalis.",
    location: "Udaipur City, Rajasthan",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Rajasthani Thali, Gujarati Thali, Dal Baati",
    imageUrl: null,
  },
  {
    name: "Millets of Mewar",
    destination: "Udaipur",
    cuisine: "Healthy Indian",
    description:
      "A restaurant focused on healthy vegetarian and millet-based dishes.",
    location: "Udaipur, Rajasthan",
    priceRange: "₹₹",
    rating: 4.4,
    specialties:
      "Millet Dishes, Vegetarian Food, Healthy Meals",
    imageUrl: null,
  },

  // =========================================================
  // AMRITSAR
  // =========================================================

  {
    name: "Kesar Da Dhaba",
    destination: "Amritsar",
    cuisine: "Punjabi",
    description:
      "A historic restaurant famous for traditional Punjabi vegetarian food.",
    location: "Old City, Amritsar, Punjab",
    priceRange: "₹₹",
    rating: 4.4,
    specialties:
      "Dal, Amritsari Kulcha, Paneer, Lassi",
    imageUrl: null,
  },
  {
    name: "Bharawan Da Dhaba",
    destination: "Amritsar",
    cuisine: "Punjabi",
    description:
      "A traditional Punjabi restaurant serving hearty local dishes.",
    location: "Heritage Street, Amritsar, Punjab",
    priceRange: "₹₹",
    rating: 4.2,
    specialties:
      "Amritsari Kulcha, Chole, Dal, Lassi",
    imageUrl: null,
  },
  {
    name: "Beera Chicken House",
    destination: "Amritsar",
    cuisine: "Punjabi",
    description:
      "A popular local restaurant known for traditional Punjabi chicken dishes.",
    location: "Majitha Road, Amritsar, Punjab",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Tandoori Chicken, Chicken Tikka, Punjabi Curries",
    imageUrl: null,
  },

  // =========================================================
  // AHMEDABAD
  // =========================================================

  {
    name: "Agashiye",
    destination: "Ahmedabad",
    cuisine: "Gujarati",
    description:
      "An elegant rooftop restaurant serving traditional Gujarati cuisine.",
    location: "Lal Darwaja, Ahmedabad, Gujarat",
    priceRange: "₹₹₹₹",
    rating: 4.5,
    specialties:
      "Gujarati Thali, Farsan, Traditional Sweets",
    imageUrl: null,
  },
  {
    name: "Gordhan Thal",
    destination: "Ahmedabad",
    cuisine: "Gujarati",
    description:
      "A popular restaurant specializing in elaborate Gujarati thalis.",
    location: "Ahmedabad, Gujarat",
    priceRange: "₹₹",
    rating: 4.3,
    specialties:
      "Gujarati Thali, Dal, Rotla, Farsan",
    imageUrl: null,
  },
  {
    name: "Manek Chowk Food Street",
    destination: "Ahmedabad",
    cuisine: "Indian Street Food",
    description:
      "A famous night food market offering a wide variety of Gujarati and Indian street food.",
    location: "Manek Chowk, Ahmedabad, Gujarat",
    priceRange: "₹",
    rating: 4.2,
    specialties:
      "Pav Bhaji, Sandwiches, Dosas, Gujarati Snacks",
    imageUrl: null,
  },
];



async function seedRestaurants() {
  console.log("🍽️ Starting restaurant seed...");
  console.log(`📊 Restaurants to insert: ${restaurants.length}`);

  try {
    let inserted = 0;

    for (const restaurant of restaurants) {
      const existingRestaurants =
        await db.orm.public.Restaurant.all();

      const alreadyExists = existingRestaurants.some(
        (existing) =>
          existing.name === restaurant.name &&
          existing.destination === restaurant.destination
      );

      if (alreadyExists) {
        console.log(
          `⏭️ Already exists: ${restaurant.name} (${restaurant.destination})`
        );
        continue;
      }
await db.orm.public.Restaurant.create({
  name: restaurant.name,
  destination: restaurant.destination,
  cuisine: restaurant.cuisine,
  description: restaurant.description,
  location: restaurant.location,
  priceRange: restaurant.priceRange,
  rating: restaurant.rating,
  specialties: restaurant.specialties,
  imageUrl: restaurant.imageUrl ?? null,
});
      inserted++;

      console.log(
        `✅ Added: ${restaurant.name} (${restaurant.destination})`
      );
    }

    console.log("");
    console.log("==========================================");
    console.log("🍽️ RESTAURANT SEED COMPLETED");
    console.log(`✅ New restaurants added: ${inserted}`);
    console.log(`📊 Total seed records: ${restaurants.length}`);
    console.log("==========================================");
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("❌ RESTAURANT SEED FAILED");
    console.error("==========================================");
    console.error(error);

    process.exitCode = 1;
  }
}

seedRestaurants().catch((error) => {
  console.error("❌ Unexpected seed error:", error);
  process.exitCode = 1;
});

