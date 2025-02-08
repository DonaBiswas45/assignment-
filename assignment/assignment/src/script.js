const express = require("express");
const path = require("path");
const { SerpAPI } = require("serpapi"); // Corrected import for SerpAPI

const app = express();
const PORT = 3000;

const API_KEY = "ba76e056f2f4c554ed648e2ff49054d06377cd3b7a11dc065bb6887ffeb1c127"; 

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle POST request to fetch events
app.post("/search-events", async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const search = new SerpAPI(API_KEY);
    search.json(
      {
        engine: "google_events",
        q: `Events in ${city}`,
        hl: "en",
        gl: "in",
      },
      (data) => {
        if (data.events_results) {
          res.json({ events: data.events_results });
        } else {
          res.status(404).json({ error: "No events found" });
        }
      }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
