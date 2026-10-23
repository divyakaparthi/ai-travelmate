import "dotenv/config";

import db from "../src/prisma/db";

/* =========================================================
   TYPES
   ========================================================= */

type PlaceSeed = {
  name: string;
  destination: string;
  description: string;
  location: string;
  category: string;
  estimatedCost: string;
  bestTimeToVisit: string;
  historicalInformation: string;
  thingsToDo: string[];
  nearbyAttractions: string[];
  imageUrl: string | null;
};

/*
 * Type of a place returned by Prisma.
 *
 * We use this only for the duplicate check.
 */
type ExistingPlace = {
  id: string;
  name: string;
  destination: string;
};

/* =========================================================
   PLACES
   ========================================================= */

const places: PlaceSeed[] = [
  {
    name: "Gateway of India",
    destination: "Mumbai",
    description:
      "A historic waterfront monument and one of Mumbai's most recognizable landmarks.",
    location:
      "Apollo Bandar, Colaba, Mumbai, Maharashtra",
    category: "Historical Landmark",
    estimatedCost: "Free",
    bestTimeToVisit:
      "November to February",
    historicalInformation:
      "The Gateway of India was completed in 1924 and is one of Mumbai's best-known landmarks.",
    thingsToDo: [
      "Take photographs",
      "Enjoy the waterfront",
      "Visit the nearby Taj Mahal Palace",
      "Explore Colaba",
    ],
    nearbyAttractions: [
      "Taj Mahal Palace",
      "Colaba Causeway",
      "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
      "Marine Drive",
    ],
    imageUrl: null,
  },

  {
    name: "Marine Drive",
    destination: "Mumbai",
    description:
      "A scenic coastal boulevard along Mumbai's Arabian Sea waterfront, famous for its evening views.",
    location:
      "Netaji Subhash Chandra Bose Road, Mumbai, Maharashtra",
    category: "Scenic Attraction",
    estimatedCost: "Free",
    bestTimeToVisit:
      "October to March",
    historicalInformation:
      "Marine Drive is one of Mumbai's most recognizable public waterfront spaces.",
    thingsToDo: [
      "Watch the sunset",
      "Walk along the promenade",
      "Take photographs",
      "Enjoy the sea view",
    ],
    nearbyAttractions: [
      "Girgaon Chowpatty",
      "Gateway of India",
      "Chhatrapati Shivaji Maharaj Terminus",
    ],
    imageUrl: null,
  },

  {
    name: "Chhatrapati Shivaji Maharaj Terminus",
    destination: "Mumbai",
    description:
      "A historic railway terminus known for its Victorian Gothic architecture.",
    location:
      "Chhatrapati Shivaji Maharaj Terminus, Mumbai, Maharashtra",
    category: "Heritage",
    estimatedCost:
      "Free to view from outside",
    bestTimeToVisit:
      "October to March",
    historicalInformation:
      "The building was completed in 1888 and is an important example of Victorian Gothic architecture in India.",
    thingsToDo: [
      "Admire the architecture",
      "Take photographs",
      "Explore the surrounding heritage district",
    ],
    nearbyAttractions: [
      "Crawford Market",
      "Marine Drive",
      "Gateway of India",
    ],
    imageUrl: null,
  },

  {
    name: "Elephanta Caves",
    destination: "Mumbai",
    description:
      "A UNESCO World Heritage Site containing ancient rock-cut caves and sculptures on Elephanta Island.",
    location:
      "Elephanta Island, Mumbai Harbour, Maharashtra",
    category: "Historical Site",
    estimatedCost:
      "Entry and ferry charges apply",
    bestTimeToVisit:
      "November to February",
    historicalInformation:
      "The caves contain rock-cut sculptures and temples dating primarily from the medieval period.",
    thingsToDo: [
      "Explore the cave temples",
      "See the large Shiva sculptures",
      "Take a ferry from Mumbai",
      "Explore Elephanta Island",
    ],
    nearbyAttractions: [
      "Gateway of India",
      "Colaba",
      "Taj Mahal Palace",
    ],
    imageUrl: null,
  },

  {
    name: "Red Fort",
    destination: "Delhi",
    description:
      "A historic Mughal-era fort complex and major heritage attraction in Delhi.",
    location:
      "Netaji Subhash Marg, Old Delhi, Delhi",
    category: "Historical Monument",
    estimatedCost:
      "Entry fee varies by visitor category",
    bestTimeToVisit:
      "October to March",
    historicalInformation:
      "The Red Fort was commissioned by Mughal emperor Shah Jahan and completed in the 17th century.",
    thingsToDo: [
      "Explore the fort complex",
      "Visit the museums",
      "Learn about Mughal history",
      "Explore Old Delhi",
    ],
    nearbyAttractions: [
      "Jama Masjid",
      "Chandni Chowk",
      "Raj Ghat",
    ],
    imageUrl: null,
  },

  {
    name: "India Gate",
    destination: "Delhi",
    description:
      "A prominent war memorial and landmark located in central New Delhi.",
    location:
      "Kartavya Path, New Delhi, Delhi",
    category: "Monument",
    estimatedCost: "Free",
    bestTimeToVisit:
      "October to March",
    historicalInformation:
      "India Gate is a war memorial dedicated to Indian soldiers who died during World War I and related conflicts.",
    thingsToDo: [
      "Visit the memorial",
      "Take photographs",
      "Walk around the surrounding area",
      "Visit nearby landmarks",
    ],
    nearbyAttractions: [
      "Kartavya Path",
      "National War Memorial",
      "Rashtrapati Bhavan",
    ],
    imageUrl: null,
  },

  {
    name: "Qutub Minar",
    destination: "Delhi",
    description:
      "A historic minaret and UNESCO World Heritage Site surrounded by medieval architectural remains.",
    location:
      "Mehrauli, New Delhi, Delhi",
    category: "Historical Monument",
    estimatedCost:
      "Entry fee varies by visitor category",
    bestTimeToVisit:
      "October to March",
    historicalInformation:
      "Construction of the Qutub Minar complex began in the late 12th century and continued under successive rulers.",
    thingsToDo: [
      "Explore the monument complex",
      "Study the historic architecture",
      "Take photographs",
      "Visit nearby archaeological sites",
    ],
    nearbyAttractions: [
      "Mehrauli Archaeological Park",
      "Lotus Temple",
      "Humayun's Tomb",
    ],
    imageUrl: null,
  },

  {
    name: "Charminar",
    destination: "Hyderabad",
    description:
      "A historic monument in the heart of Hyderabad and one of the city's most recognizable landmarks.",
    location:
      "Charminar Road, Hyderabad, Telangana",
    category: "Historical Monument",
    estimatedCost:
      "Entry fee varies by visitor category",
    bestTimeToVisit:
      "October to February",
    historicalInformation:
      "Charminar was constructed in 1591 and is traditionally associated with the founding of Hyderabad.",
    thingsToDo: [
      "Explore the monument",
      "Visit Laad Bazaar",
      "Try local Hyderabadi food",
      "Take photographs",
    ],
    nearbyAttractions: [
      "Laad Bazaar",
      "Mecca Masjid",
      "Chowmahalla Palace",
    ],
    imageUrl: null,
  },

  {
    name: "Golconda Fort",
    destination: "Hyderabad",
    description:
      "A historic fort complex known for its massive walls, gateways and views over Hyderabad.",
    location:
      "Ibrahim Bagh, Hyderabad, Telangana",
    category: "Fort",
    estimatedCost:
      "Entry fee varies by visitor category",
    bestTimeToVisit:
      "October to February",
    historicalInformation:
      "Golconda developed into an important fortified city under the Qutb Shahi rulers.",
    thingsToDo: [
      "Explore the fort",
      "Visit the viewpoints",
      "Learn about the Qutb Shahi period",
      "Attend the sound and light show when available",
    ],
    nearbyAttractions: [
      "Qutb Shahi Tombs",
      "Charminar",
      "Mecca Masjid",
    ],
    imageUrl: null,
  },

  {
    name: "Baga Beach",
    destination: "Goa",
    description:
      "A popular beach in North Goa known for its sandy shoreline, restaurants and water activities.",
    location:
      "Baga, North Goa, Goa",
    category: "Beach",
    estimatedCost:
      "Free entry; activities vary",
    bestTimeToVisit:
      "November to February",
    historicalInformation:
      "Baga is part of Goa's well-known northern coastal tourism area.",
    thingsToDo: [
      "Relax on the beach",
      "Try water activities",
      "Enjoy local restaurants",
      "Watch the sunset",
    ],
    nearbyAttractions: [
      "Calangute Beach",
      "Anjuna Beach",
      "Fort Aguada",
    ],
    imageUrl: null,
  },

  {
    name: "Hawa Mahal",
    destination: "Jaipur",
    description:
      "An iconic Jaipur palace façade known for its distinctive honeycomb-style windows.",
    location:
      "Hawa Mahal Road, Jaipur, Rajasthan",
    category: "Palace",
    estimatedCost:
      "Entry fee varies by visitor category",
    bestTimeToVisit:
      "October to March",
    historicalInformation:
      "Hawa Mahal was built in 1799 during the reign of Maharaja Sawai Pratap Singh.",
    thingsToDo: [
      "Explore the palace",
      "Take photographs",
      "Visit nearby markets",
      "Explore the City Palace area",
    ],
    nearbyAttractions: [
      "City Palace",
      "Jantar Mantar",
      "Amber Fort",
    ],
    imageUrl: null,
  },

  {
    name: "Taj Mahal",
    destination: "Agra",
    description:
      "A world-famous marble mausoleum and UNESCO World Heritage Site on the banks of the Yamuna River.",
    location:
      "Dharmapuri, Forest Colony, Agra, Uttar Pradesh",
    category: "Monument",
    estimatedCost:
      "Entry fee varies by visitor category",
    bestTimeToVisit:
      "October to March",
    historicalInformation:
      "The Taj Mahal was commissioned by Mughal emperor Shah Jahan in memory of Mumtaz Mahal and was completed in the 17th century.",
    thingsToDo: [
      "Explore the monument",
      "Visit the surrounding gardens",
      "Take photographs",
      "Learn about Mughal architecture",
    ],
    nearbyAttractions: [
      "Agra Fort",
      "Mehtab Bagh",
      "Itmad-ud-Daulah's Tomb",
    ],
    imageUrl: null,
  },
];

/* =========================================================
   SEED FUNCTION
   ========================================================= */

async function seedPlaces() {
  console.log("");
  console.log("==========================================");
  console.log("🌱 AI TravelMate Place Seeder");
  console.log("==========================================");

  try {
    /*
     * Get existing places.
     */
    const existingPlaces =
      await db.orm.public.Place.all();

    /*
     * Convert the records to the small type
     * we need for duplicate checking.
     */
    const existing: ExistingPlace[] =
      existingPlaces.map((place) => ({
        id: String(place.id),
        name: String(place.name),
        destination: String(
          place.destination
        ),
      }));

    console.log(
      `📊 Existing places: ${existing.length}`
    );

    console.log(
      `📦 Places available for seeding: ${places.length}`
    );

    let inserted = 0;
    let skipped = 0;

    /*
     * Insert each place.
     */
    for (const place of places) {
      const duplicate =
        existing.find(
          (item: ExistingPlace) =>
            item.name.toLowerCase() ===
              place.name.toLowerCase() &&
            item.destination.toLowerCase() ===
              place.destination.toLowerCase()
        );

      /*
       * Don't insert duplicates.
       */
      if (duplicate) {
        console.log(
          `⏭️ Already exists: ${place.name}`
        );

        skipped++;

        continue;
      }

      /*
       * Create database record.
       */
      const created =
        await db.orm.public.Place.create({
          name: place.name,

          destination:
            place.destination,

          description:
            place.description,

          location:
            place.location,

          category:
            place.category,

          estimatedCost:
            place.estimatedCost,

          bestTimeToVisit:
            place.bestTimeToVisit,

          historicalInformation:
            place.historicalInformation,

          thingsToDo:
            JSON.stringify(
              place.thingsToDo
            ),

          nearbyAttractions:
            JSON.stringify(
              place.nearbyAttractions
            ),

          imageUrl:
            place.imageUrl,
        });

      console.log(
        `✅ Inserted: ${created.name}`
      );

      inserted++;
    }

    console.log("");
    console.log("==========================================");
    console.log("🎉 SEED COMPLETED");
    console.log("==========================================");
    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    console.log(
      `📊 Total places now: ${
        existing.length + inserted
      }`
    );
    console.log("==========================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("❌ PLACE SEED FAILED");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");
    console.error("");
  }
}

/* =========================================================
   START
   ========================================================= */

void seedPlaces();