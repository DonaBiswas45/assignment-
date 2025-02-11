const express = require("express");
const path = require("path");
require("dotenv").config();
const { getJson } = require("serpapi");

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle POST request to fetch events
app.post("/", async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const result = await getJson({
      engine: "google_events",
      q: `Events in ${city}`,
      hl: "en",
      gl: "in",
      api_key: API_KEY,
    });

    if (result.events_results) {
      const data = result.events_result;
      console.log(data);
      res.json({ events: result.events_results });
    } else {
      res.status(500).json({ error: "No events found" });
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
