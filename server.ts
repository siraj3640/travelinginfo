import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for server-side configured user OpenAI API keys
let globalCustomOpenAIKey = process.env.OPENAI_API_KEY || "";

// Mock server-side database for bus companies, routes, and bookings
const BUS_COMPANIES = [
  {
    id: "comp-1",
    name: "AeroExpress Lines",
    logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 1240,
    description: "Premium intercity bus travel with ultra-wide leather seats, high-speed Starlink Wi-Fi, and complimentary snacks.",
    amenities: ["Wi-Fi", "Power Outlets", "Extra Legroom", "Restroom", "Snack Bar", "Entertainment"],
    badge: "Top Rated",
    contactPhone: "+1 (800) 555-0199"
  },
  {
    id: "comp-2",
    name: "Pacific Horizon Shuttles",
    logo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=120&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 890,
    description: "Eco-friendly hybrid coach fleet connecting coastal cities with affordable prices and daily frequent schedules.",
    amenities: ["Wi-Fi", "Power Outlets", "Climate Control", "Restroom", "Luggage Storage"],
    badge: "Eco Coach",
    contactPhone: "+1 (800) 555-0248"
  },
  {
    id: "comp-3",
    name: "MetroLink Express",
    logo: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=120&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviewsCount: 2150,
    description: "Direct city-center to city-center express routes designed for business commuters and daily travelers.",
    amenities: ["Wi-Fi", "Power Outlets", "Quiet Zone", "Reclining Seats", "Restroom"],
    badge: "Most Express",
    contactPhone: "+1 (800) 555-0371"
  },
  {
    id: "comp-4",
    name: "Royal Coach Luxury",
    logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 620,
    description: "VIP 2+1 seat layout with first-class sleeper style recliners, attendant service, and noise-canceling ambiance.",
    amenities: ["Wi-Fi", "Power Outlets", "2+1 VIP Seating", "Warm Blankets", "Onboard Meals", "Restroom"],
    badge: "Luxury VIP",
    contactPhone: "+1 (800) 555-0412"
  }
];

const BUS_ROUTES = [
  {
    id: "route-101",
    companyId: "comp-1",
    companyName: "AeroExpress Lines",
    companyLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80",
    origin: "New York, NY",
    originTerminal: "Port Authority Bus Terminal",
    destination: "Boston, MA",
    destinationTerminal: "South Station Bus Terminal",
    departureTime: "07:30 AM",
    arrivalTime: "11:45 AM",
    durationHours: "4h 15m",
    price: 38.50,
    busType: "Executive Double Decker",
    amenities: ["Wi-Fi", "Power Outlets", "Restroom", "Extra Legroom"],
    totalSeats: 48,
    availableSeats: 18,
    bookedSeatNumbers: ["1A", "1B", "2A", "3C", "4D", "12A", "12B"],
    scheduleDays: ["Daily"]
  },
  {
    id: "route-102",
    companyId: "comp-1",
    companyName: "AeroExpress Lines",
    companyLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80",
    origin: "New York, NY",
    originTerminal: "Port Authority Bus Terminal",
    destination: "Washington, DC",
    destinationTerminal: "Union Station Bus Concourse",
    departureTime: "09:00 AM",
    arrivalTime: "01:30 PM",
    durationHours: "4h 30m",
    price: 42.00,
    busType: "Executive Double Decker",
    amenities: ["Wi-Fi", "Power Outlets", "Restroom", "Snack Bar"],
    totalSeats: 48,
    availableSeats: 22,
    bookedSeatNumbers: ["1A", "2B", "5C"],
    scheduleDays: ["Daily"]
  },
  {
    id: "route-103",
    companyId: "comp-3",
    companyName: "MetroLink Express",
    companyLogo: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=120&auto=format&fit=crop&q=80",
    origin: "Boston, MA",
    originTerminal: "South Station Bus Terminal",
    destination: "New York, NY",
    destinationTerminal: "Port Authority Bus Terminal",
    departureTime: "02:15 PM",
    arrivalTime: "06:30 PM",
    durationHours: "4h 15m",
    price: 34.00,
    busType: "Standard Coach",
    amenities: ["Wi-Fi", "Power Outlets", "Quiet Zone"],
    totalSeats: 40,
    availableSeats: 12,
    bookedSeatNumbers: ["3A", "3B", "4A", "4B", "8C"],
    scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  {
    id: "route-104",
    companyId: "comp-2",
    companyName: "Pacific Horizon Shuttles",
    origin: "San Francisco, CA",
    originTerminal: "Salesforce Transit Center",
    destination: "Los Angeles, CA",
    destinationTerminal: "Union Station Patsaouras Transit Plaza",
    departureTime: "08:00 AM",
    arrivalTime: "02:30 PM",
    durationHours: "6h 30m",
    price: 49.99,
    busType: "Eco Hybrid Cruiser",
    amenities: ["Wi-Fi", "Power Outlets", "Restroom", "Climate Control"],
    totalSeats: 44,
    availableSeats: 15,
    bookedSeatNumbers: ["1A", "1B", "6C", "7D"],
    scheduleDays: ["Daily"]
  },
  {
    id: "route-105",
    companyId: "comp-4",
    companyName: "Royal Coach Luxury",
    origin: "Washington, DC",
    originTerminal: "Union Station Bus Concourse",
    destination: "Philadelphia, PA",
    destinationTerminal: "30th Street Station Bus Bay",
    departureTime: "11:00 AM",
    arrivalTime: "01:30 PM",
    durationHours: "2h 30m",
    price: 55.00,
    busType: "VIP 2+1 Sleeper",
    amenities: ["Wi-Fi", "Power Outlets", "2+1 VIP Seating", "Warm Blankets", "Onboard Meals"],
    totalSeats: 28,
    availableSeats: 8,
    bookedSeatNumbers: ["1A", "2A", "3A", "4B"],
    scheduleDays: ["Daily"]
  },
  {
    id: "route-106",
    companyId: "comp-3",
    companyName: "MetroLink Express",
    origin: "Chicago, IL",
    originTerminal: "Union Station Transit Hub",
    destination: "Detroit, MI",
    destinationTerminal: "Rosa Parks Transit Center",
    departureTime: "10:30 AM",
    arrivalTime: "03:45 PM",
    durationHours: "5h 15m",
    price: 39.00,
    busType: "Express Coach",
    amenities: ["Wi-Fi", "Power Outlets", "Restroom"],
    totalSeats: 40,
    availableSeats: 24,
    bookedSeatNumbers: ["10A", "10B"],
    scheduleDays: ["Daily"]
  }
];

const BOOKINGS_DB: any[] = [];

// API Routes

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "travelinginfo", time: new Date().toISOString() });
});

// Get Bus Companies
app.get("/api/bus-companies", (_req, res) => {
  res.json({ companies: BUS_COMPANIES });
});

// Get Bus Routes (with optional query parameters)
app.get("/api/bus-routes", (req, res) => {
  const { origin, destination, companyId } = req.query;
  let filtered = [...BUS_ROUTES];

  if (origin && typeof origin === "string") {
    filtered = filtered.filter(r => r.origin.toLowerCase().includes(origin.toLowerCase()));
  }
  if (destination && typeof destination === "string") {
    filtered = filtered.filter(r => r.destination.toLowerCase().includes(destination.toLowerCase()));
  }
  if (companyId && typeof companyId === "string") {
    filtered = filtered.filter(r => r.companyId === companyId);
  }

  res.json({ routes: filtered });
});

// Save or Update user OpenAI Key
app.post("/api/settings/openai-key", (req, res) => {
  const { apiKey } = req.body;
  if (typeof apiKey === "string") {
    globalCustomOpenAIKey = apiKey.trim();
    return res.json({
      success: true,
      message: apiKey ? "OpenAI API key saved successfully." : "OpenAI API key cleared.",
      hasKey: !!globalCustomOpenAIKey,
      maskedKey: globalCustomOpenAIKey ? `${globalCustomOpenAIKey.slice(0, 7)}...${globalCustomOpenAIKey.slice(-4)}` : null
    });
  }
  res.status(400).json({ error: "Invalid API key format" });
});

// Get OpenAI key status
app.get("/api/settings/openai-key", (_req, res) => {
  const activeKey = globalCustomOpenAIKey || process.env.OPENAI_API_KEY || "";
  res.json({
    hasKey: !!activeKey,
    source: globalCustomOpenAIKey ? "custom" : (process.env.OPENAI_API_KEY ? "env" : "none"),
    maskedKey: activeKey ? `${activeKey.slice(0, 7)}...${activeKey.slice(-4)}` : null
  });
});

// OpenAI / Gemini AI Assistant Endpoint
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { prompt, userApiKey, history } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const apiKeyToUse = (userApiKey && userApiKey.trim()) || globalCustomOpenAIKey || process.env.OPENAI_API_KEY;

    // System prompt tailored to travelinginfo bus travel platform
    const systemInstruction = `You are "TravelBot", the official intelligent travel assistant for travelinginfo - a modern bus booking & schedule platform.
Your primary job is to answer questions about bus companies, travel schedules, luggage limits, seat selection advice, destination highlights, packing recommendations, and itinerary planning.
Be friendly, helpful, concise, and structured. Use formatting like bullet points or bold text when listing choices.
If asked about route prices or bus companies on travelinginfo, mention our partner carriers like AeroExpress Lines, Pacific Horizon Shuttles, MetroLink Express, and Royal Coach Luxury.`;

    // 1. If OpenAI API key is provided, use official OpenAI SDK
    if (apiKeyToUse) {
      try {
        const openai = new OpenAI({ apiKey: apiKeyToUse });
        
        const messages: any[] = [
          { role: "system", content: systemInstruction }
        ];

        if (Array.isArray(history)) {
          for (const msg of history) {
            if (msg.role && msg.content) {
              messages.push({ role: msg.role === "user" ? "user" : "assistant", content: msg.content });
            }
          }
        }

        messages.push({ role: "user", content: prompt });

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7,
          max_tokens: 600,
        });

        const reply = completion.choices[0]?.message?.content || "I couldn't process your travel question. Please try asking again.";
        return res.json({
          reply,
          provider: "OpenAI (gpt-4o-mini)",
          status: "success"
        });
      } catch (err: any) {
        console.error("OpenAI API error:", err?.message || err);
        // Fall back gracefully if OpenAI key fails or rate limits
      }
    }

    // 2. Built-in Smart Fallback Engine with context matching
    const lowerPrompt = prompt.toLowerCase();
    let reply = "";

    if (lowerPrompt.includes("boston") || lowerPrompt.includes("new york") || lowerPrompt.includes("ny")) {
      reply = `🚌 **New York ↔ Boston Bus Travel Guide**\n\n- **Travel Duration:** Approx. 4 hours 15 mins.\n- **Recommended Carrier:** **AeroExpress Lines** (Departs 07:30 AM & 02:15 PM daily from Port Authority Terminal).\n- **Ticket Price:** From $34.00 - $38.50.\n- **Amenities:** Starlink High-Speed Wi-Fi, AC power outlets, spacious extra legroom seats, and clean onboard restroom.\n- **Travel Tip:** Arrive 15 minutes before departure for smooth luggage loading. Seat 1A & 1B offer panoramic upper-deck views!`;
    } else if (lowerPrompt.includes("pack") || lowerPrompt.includes("luggage") || lowerPrompt.includes("bring")) {
      reply = `🧳 **Essential Bus Travel Packing Checklist**\n\n1. **Carry-On Essentials:** Headphones/Earbuds, portable power bank, water bottle, light neck pillow, and valid ID/boarding pass.\n2. **Luggage Policy:** On travelinginfo, most carriers allow **1 free under-bus suitcase** (up to 50 lbs) plus 1 small personal item onboard.\n3. **Comfort Advice:** Dress in layers! Bus cabin temperatures can vary between morning and afternoon.`;
    } else if (lowerPrompt.includes("seat") || lowerPrompt.includes("best seat")) {
      reply = `💺 **How to Pick the Best Seat on your Bus Journey:**\n\n- **For Maximum Legroom:** Choose Row 1 (Front Row) or exit row seats.\n- **For a Quiet Ride:** Opt for mid-cabin window seats (Rows 4 to 8), away from the rear engine and restroom.\n- **For Smooth Motion:** Front to middle section seats experience the least vibration.\n- **For Couples/Friends:** Double seats like 2A & 2B allow side-by-side travel!`;
    } else if (lowerPrompt.includes("company") || lowerPrompt.includes("companies") || lowerPrompt.includes("carrier")) {
      reply = `🌟 **Featured Bus Companies on travelinginfo:**\n\n1. **AeroExpress Lines** (Rating: 4.8★) - Executive Double Decker with Starlink Wi-Fi & free snacks.\n2. **Pacific Horizon Shuttles** (Rating: 4.6★) - Eco-friendly hybrid coach connecting coastal cities.\n3. **MetroLink Express** (Rating: 4.5★) - Fast, express city center routes for commuters.\n4. **Royal Coach Luxury** (Rating: 4.9★) - VIP 2+1 seating with sleeper recliners & warm blankets.`;
    } else {
      reply = `Hello! I am your AI Travel Assistant on **travelinginfo**.\n\nI can assist you with:\n- 📍 Checking bus routes, company ratings, and departure times.\n- 💺 Recommending the best seats for long-distance trips.\n- 🧳 Luggage policies, packing tips, and boarding procedures.\n- 🌇 Destination itineraries and travel tips for NYC, Boston, DC, SF, and LA!\n\nHow can I help you plan your journey today?`;
    }

    return res.json({
      reply,
      provider: "travelinginfo Smart Assistant (Configure OpenAI Key in Settings for live GPT-4 responses)",
      status: "success"
    });

  } catch (error: any) {
    console.error("AI Assistant Endpoint Error:", error);
    res.status(500).json({ error: "Failed to generate travel assistance response." });
  }
});

// Bookings API endpoints
app.get("/api/bookings", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    return res.json({ bookings: BOOKINGS_DB.filter(b => b.userId === userId) });
  }
  res.json({ bookings: BOOKINGS_DB });
});

app.post("/api/bookings", (req, res) => {
  const newBooking = req.body;
  if (!newBooking || !newBooking.routeId) {
    return res.status(400).json({ error: "Invalid booking data" });
  }

  const bookingWithId = {
    ...newBooking,
    id: `bk-${Date.now()}`,
    bookingRef: `TI-${Math.floor(100000 + Math.random() * 900000)}`,
    bookedAt: new Date().toISOString(),
    status: "confirmed"
  };

  BOOKINGS_DB.push(bookingWithId);
  res.status(201).json({ success: true, booking: bookingWithId });
});

// Serve frontend with Vite in Dev, or Static build in Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`travelinginfo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
