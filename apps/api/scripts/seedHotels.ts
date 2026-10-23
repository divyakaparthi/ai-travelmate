import "dotenv/config";

import db from "../src/prisma/db";
type HotelSeed = {
  name: string;
  destination: string;
  category: string;
  description: string;
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string;
  imageUrl: string;
};

type ExistingHotel = {
  name: string;
  destination: string;
};

const accommodations: HotelSeed[] = [
  // =========================================================
  // CHENNAI
  // =========================================================

  {
    name: "The Park Chennai",
    destination: "Chennai",
    category: "Hotel",
    description:
      "Modern hotel in central Chennai with comfortable rooms and convenient access to major attractions.",
    location: "Anna Salai, Chennai",
    pricePerNight: 4200,
    rating: 4.3,
    amenities:
      "Wi-Fi, Restaurant, Swimming Pool, Gym, Room Service",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },

  {
    name: "Taj Club House",
    destination: "Chennai",
    category: "Hotel",
    description:
      "Comfortable city hotel offering modern rooms, dining and easy access to Chennai's business district.",
    location: "Mount Road, Chennai",
    pricePerNight: 4800,
    rating: 4.4,
    amenities:
      "Wi-Fi, Restaurant, Pool, Gym, Breakfast, Parking",
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  },

  {
    name: "Zostel Chennai",
    destination: "Chennai",
    category: "Hostel",
    description:
      "Budget-friendly hostel suitable for backpackers and solo travelers looking for a social stay.",
    location: "Mylapore, Chennai",
    pricePerNight: 650,
    rating: 4.4,
    amenities:
      "Wi-Fi, Shared Kitchen, Lockers, Common Room, Laundry",
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
  },

  {
    name: "Chennai Backpackers Hostel",
    destination: "Chennai",
    category: "Hostel",
    description:
      "Affordable hostel with shared accommodation and facilities designed for budget travelers.",
    location: "T. Nagar, Chennai",
    pricePerNight: 550,
    rating: 4.2,
    amenities:
      "Wi-Fi, Lockers, Shared Kitchen, Lounge, Laundry",
    imageUrl:
      "https://images.unsplash.com/photo-1520277739336-7bf67edfae0e",
  },

  // =========================================================
  // MUMBAI
  // =========================================================

  {
    name: "Hotel Marine Plaza",
    destination: "Mumbai",
    category: "Hotel",
    description:
      "Comfortable hotel close to Marine Drive and several major attractions in South Mumbai.",
    location: "Marine Drive, Mumbai",
    pricePerNight: 5200,
    rating: 4.3,
    amenities:
      "Wi-Fi, Restaurant, Pool, Breakfast, Room Service",
    imageUrl:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
  },

  {
    name: "The Orchid Mumbai",
    destination: "Mumbai",
    category: "Hotel",
    description:
      "Well-equipped hotel near the airport with modern rooms and convenient business facilities.",
    location: "Vile Parle, Mumbai",
    pricePerNight: 4600,
    rating: 4.2,
    amenities:
      "Wi-Fi, Restaurant, Gym, Pool, Airport Shuttle",
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  },

  {
    name: "Zostel Mumbai",
    destination: "Mumbai",
    category: "Hostel",
    description:
      "Social and affordable hostel for backpackers and solo travelers exploring Mumbai.",
    location: "Andheri East, Mumbai",
    pricePerNight: 750,
    rating: 4.3,
    amenities:
      "Wi-Fi, Lockers, Common Room, Shared Kitchen, Laundry",
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
  },

  {
    name: "Backpacker Panda Mumbai",
    destination: "Mumbai",
    category: "Hostel",
    description:
      "Budget accommodation with shared rooms and social spaces for independent travelers.",
    location: "Colaba, Mumbai",
    pricePerNight: 700,
    rating: 4.1,
    amenities:
      "Wi-Fi, Lockers, Lounge, Shared Kitchen, Laundry",
    imageUrl:
      "https://images.unsplash.com/photo-1520277739336-7bf67edfae0e",
  },

  // =========================================================
  // DELHI
  // =========================================================

  {
    name: "The Metropolitan Hotel",
    destination: "Delhi",
    category: "Hotel",
    description:
      "Comfortable hotel in central Delhi with modern rooms and convenient city access.",
    location: "Connaught Place, New Delhi",
    pricePerNight: 4300,
    rating: 4.4,
    amenities:
      "Wi-Fi, Restaurant, Pool, Gym, Breakfast",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },

  {
    name: "Bloomrooms @ Janpath",
    destination: "Delhi",
    category: "Hotel",
    description:
      "Modern budget-friendly hotel near central Delhi attractions and shopping areas.",
    location: "Janpath, New Delhi",
    pricePerNight: 3200,
    rating: 4.2,
    amenities:
      "Wi-Fi, Breakfast, Restaurant, Parking",
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  },

  {
    name: "The Hosteller Delhi",
    destination: "Delhi",
    category: "Hostel",
    description:
      "Budget hostel designed for backpackers, students and solo travelers visiting Delhi.",
    location: "Saket, New Delhi",
    pricePerNight: 600,
    rating: 4.3,
    amenities:
      "Wi-Fi, Lockers, Common Area, Games Room, Shared Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
  },

  {
    name: "Zostel Delhi",
    destination: "Delhi",
    category: "Hostel",
    description:
      "Affordable backpacker-style accommodation with dormitory and private rooms.",
    location: "Paharganj, New Delhi",
    pricePerNight: 550,
    rating: 4.2,
    amenities:
      "Wi-Fi, Lockers, Lounge, Shared Kitchen, Laundry",
    imageUrl:
      "https://images.unsplash.com/photo-1520277739336-7bf67edfae0e",
  },

  // =========================================================
  // HYDERABAD
  // =========================================================

  {
    name: "Taj Krishna Hyderabad",
    destination: "Hyderabad",
    category: "Hotel",
    description:
      "Upscale hotel with comfortable rooms, dining facilities and easy access to central Hyderabad.",
    location: "Banjara Hills, Hyderabad",
    pricePerNight: 5000,
    rating: 4.5,
    amenities:
      "Wi-Fi, Restaurant, Pool, Gym, Breakfast, Spa",
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  },

  {
    name: "Trident Hyderabad",
    destination: "Hyderabad",
    category: "Hotel",
    description:
      "Modern business and leisure hotel located close to Hyderabad's major commercial areas.",
    location: "HITEC City, Hyderabad",
    pricePerNight: 5600,
    rating: 4.6,
    amenities:
      "Wi-Fi, Restaurants, Pool, Gym, Parking",
    imageUrl:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
  },

  {
    name: "Zostel Hyderabad",
    destination: "Hyderabad",
    category: "Hostel",
    description:
      "Affordable accommodation for backpackers and solo travelers exploring Hyderabad.",
    location: "Gachibowli, Hyderabad",
    pricePerNight: 600,
    rating: 4.3,
    amenities:
      "Wi-Fi, Lockers, Common Room, Games, Shared Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
  },

  {
    name: "Hyderabad Backpackers Hostel",
    destination: "Hyderabad",
    category: "Hostel",
    description:
      "Simple and affordable hostel with shared rooms and traveler-friendly common spaces.",
    location: "Madhapur, Hyderabad",
    pricePerNight: 500,
    rating: 4.1,
    amenities:
      "Wi-Fi, Lockers, Lounge, Kitchen, Laundry",
    imageUrl:
      "https://images.unsplash.com/photo-1520277739336-7bf67edfae0e",
  },

  // =========================================================
  // BENGALURU
  // =========================================================

  {
    name: "The Chancery Pavilion",
    destination: "Bengaluru",
    category: "Hotel",
    description:
      "Comfortable city hotel close to central Bengaluru attractions and business areas.",
    location: "Residency Road, Bengaluru",
    pricePerNight: 3800,
    rating: 4.2,
    amenities:
      "Wi-Fi, Restaurant, Pool, Gym, Breakfast",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },

  {
    name: "Lemon Tree Premier Bengaluru",
    destination: "Bengaluru",
    category: "Hotel",
    description:
      "Modern hotel offering comfortable rooms and convenient facilities for business and leisure travelers.",
    location: "Ulsoor, Bengaluru",
    pricePerNight: 4100,
    rating: 4.3,
    amenities:
      "Wi-Fi, Restaurant, Gym, Pool, Breakfast",
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  },

  {
    name: "Zostel Bengaluru",
    destination: "Bengaluru",
    category: "Hostel",
    description:
      "Affordable social hostel suitable for solo travelers and backpackers visiting Bengaluru.",
    location: "Indiranagar, Bengaluru",
    pricePerNight: 650,
    rating: 4.4,
    amenities:
      "Wi-Fi, Lockers, Common Room, Shared Kitchen, Laundry",
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
  },

  {
    name: "Woke Hostel Bengaluru",
    destination: "Bengaluru",
    category: "Hostel",
    description:
      "Budget-friendly hostel with shared spaces and facilities designed for young travelers.",
    location: "Koramangala, Bengaluru",
    pricePerNight: 600,
    rating: 4.2,
    amenities:
      "Wi-Fi, Lockers, Lounge, Kitchen, Games Room",
    imageUrl:
      "https://images.unsplash.com/photo-1520277739336-7bf67edfae0e",
  },

  // =========================================================
  // GOA
  // =========================================================

  {
    name: "Taj Exotica Goa",
    destination: "Goa",
    category: "Hotel",
    description:
      "Beachside hotel offering comfortable accommodation and easy access to Goa's coastal attractions.",
    location: "Benaulim, Goa",
    pricePerNight: 6500,
    rating: 4.6,
    amenities:
      "Wi-Fi, Beach Access, Pool, Restaurant, Gym, Spa",
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  },

  {
    name: "The Park Calangute",
    destination: "Goa",
    category: "Hotel",
    description:
      "Stylish hotel near popular beaches, restaurants and nightlife in North Goa.",
    location: "Calangute, Goa",
    pricePerNight: 4500,
    rating: 4.3,
    amenities:
      "Wi-Fi, Pool, Restaurant, Breakfast, Beach Access",
    imageUrl:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
  },

  {
    name: "Zostel Goa",
    destination: "Goa",
    category: "Hostel",
    description:
      "Backpacker hostel with social common areas and easy access to North Goa beaches.",
    location: "Anjuna, Goa",
    pricePerNight: 700,
    rating: 4.4,
    amenities:
      "Wi-Fi, Lockers, Common Room, Pool, Shared Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
  },

  {
    name: "The Hosteller Goa",
    destination: "Goa",
    category: "Hostel",
    description:
      "Affordable hostel for solo travelers and backpackers looking for a social beach stay.",
    location: "Vagator, Goa",
    pricePerNight: 650,
    rating: 4.3,
    amenities:
      "Wi-Fi, Lockers, Pool, Lounge, Games Room",
    imageUrl:
      "https://images.unsplash.com/photo-1520277739336-7bf67edfae0e",
  },

  // =========================================================
  // BANGLORE
  // Supports older saved trips that use "Banglore"
  // =========================================================

  {
    name: "Bengaluru City Hotel",
    destination: "Banglore",
    category: "Hotel",
    description:
      "Comfortable city accommodation for travelers visiting Bengaluru.",
    location: "Central Bengaluru",
    pricePerNight: 3500,
    rating: 4.1,
    amenities:
      "Wi-Fi, Restaurant, Breakfast, Parking",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },

  {
    name: "Bengaluru Backpackers Hostel",
    destination: "Banglore",
    category: "Hostel",
    description:
      "Affordable hostel for backpackers and solo travelers.",
    location: "Koramangala, Bengaluru",
    pricePerNight: 550,
    rating: 4.2,
    amenities:
      "Wi-Fi, Lockers, Common Room, Kitchen, Laundry",
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
  },
];

async function seedHotels(): Promise<void> {
  console.log("🏨 Starting accommodation seed...");

  const existingHotels =
    await db.orm.public.Hotel.all();

  let added = 0;
  let skipped = 0;

  for (const accommodation of accommodations) {
    const alreadyExists = existingHotels.some(
      (item: ExistingHotel) =>
        item.name.toLowerCase() ===
          accommodation.name.toLowerCase() &&
        item.destination.toLowerCase() ===
          accommodation.destination.toLowerCase()
    );

    if (alreadyExists) {
      skipped++;

      console.log(
        `↪️ Skipped: ${accommodation.name} (${accommodation.destination})`
      );

      continue;
    }

    await db.orm.public.Hotel.create(
  accommodation
);

    added++;

    console.log(
      `✅ Added: ${accommodation.name} (${accommodation.destination})`
    );
  }

  console.log("");
  console.log("======================================");
  console.log("🏨 Accommodation seed completed");
  console.log(`✅ Added: ${added}`);
  console.log(`↪️ Skipped: ${skipped}`);
  console.log("======================================");
}

seedHotels().catch((error: unknown) => {
  console.error(
    "❌ Failed to seed accommodations:",
    error
  );
});