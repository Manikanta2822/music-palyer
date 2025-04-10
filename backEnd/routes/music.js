const express = require("express");
const fetch = require("node-fetch");
const axios = require("axios");
const { authMiddleware } = require("../Middleware/authMiddleware");
const router = express.Router();

const clientId = "7768647d7ed74e0ba84bc62ed4406fbb";
const clientSecret = "95eb66af51e548d288a90fe98b45bb24";
let accessToken = "";

// Get Spotify Access Token
const getSpotifyToken = async () => {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    accessToken = data.access_token;
    console.log("✅ Access token fetched.");
  } catch (err) {
    console.error("❌ Token error:", err.message);
  }
};

const ensureToken = async (req, res, next) => {
  if (!accessToken) await getSpotifyToken();
  next();
};

// 🔍 Search Tracks
router.get("/search", authMiddleware, ensureToken, async (req, res) => {
  const { query, offset = 0 } = req.query;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q: query, type: "track", limit: 50, offset },
    });

    res.json(response.data.tracks.items);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
})

// 🎵 Get Track Info
router.get("/track/:trackId", ensureToken, async (req, res) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${req.params.trackId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json(response.data);
  } catch (err) {
    const code = err.response?.status || 500;
    res.status(code).json({ message: "Track fetch failed", error: err.message });
  }
});

router.get('/recommendations/:trackId', async (req, res) => {
  const { trackId } = req.params;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    // Get track details to extract seed artist
    const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization:` Bearer ${token}`,
      },
    });

    const artistId = trackResponse.data.artists?.[0]?.id;

    // Fetch recommendations using Spotify API
    const recResponse = await axios.get('https://api.spotify.com/v1/recommendations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        seed_tracks: trackId,
        seed_artists: artistId,
        limit: 10, // You can adjust the number of recommended tracks
      },
    });

    return res.json(recResponse.data.tracks);
  } catch (error) {
    console.error('Error fetching recommendations:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

getSpotifyToken();
module.exports = router;