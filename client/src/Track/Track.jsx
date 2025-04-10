import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useMusic } from "../Context/MusicContext";
import { FaPlay } from "react-icons/fa";
import "./Track.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Track = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    setQueue,
    setCurrentIndex,
    setCurrentTrackUrl,
    setIsPlaying,
  } = useMusic();

  useEffect(() => {
    const fetchTrack = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);
      setError("");

      try {
        // ✅ Fetch track details
        const trackRes = await axios.get(
          `https://music-palyer.onrender.com/api/music/track/${trackId}`
        );
        const trackData = trackRes.data;

        setTrack(trackData);

        // Autoplay selected track
        setQueue([trackData]);
        setCurrentIndex(0);
        setCurrentTrackUrl(`https://open.spotify.com/embed/track/${trackData.id}`);
        setIsPlaying(true);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load track. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [trackId]);

  if (loading) {
    return <div className="track-page text-white text-center">Loading...</div>;
  }

  return (
    <div className="track-page">
      <div
        className="track-background"
        style={{
          backgroundImage: `url(${track.album?.images?.[0]?.url || ""})`,
        }}
      ></div>

      <div className="container track-overlay pb-5">
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <img
              src={track.album?.images?.[0]?.url || "https://via.placeholder.com/300"}
              className="track-image img-fluid rounded shadow"
              alt={track.name}
            />
          </div>
          <div className="col-md-6 text-center text-md-start track-details">
            <h2 className="text-white">{track.name}</h2>
            <p className="text-light">
              {track.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
            </p>
            <button
              className="btn btn-warning mt-3"
              onClick={() => {
                setQueue([track]);
                setCurrentIndex(0);
                setCurrentTrackUrl(`https://open.spotify.com/embed/track/${track.id}`);
                setIsPlaying(true);
              }}
            >
              <FaPlay className="me-2" />
              Play Again
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Track;
