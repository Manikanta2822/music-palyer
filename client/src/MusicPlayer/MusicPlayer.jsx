import React from "react";
import { useMusic } from "../Context/MusicContext";
import { FaStepBackward, FaStepForward } from "react-icons/fa";

const MusicPlayer = () => {
  const {
    currentTrackUrl,
    currentTrack,
    playNext,
    playPrev
  } = useMusic();

  if (!currentTrackUrl) return null;

  return (
    <div
      className="fixed-bottom w-100 bg-dark px-3 py-2 shadow"
      style={{ zIndex: 1000, overflow: "hidden" }}
    >
      <div
        className="d-flex align-items-center justify-content-between gap-2"
        style={{ maxWidth: "100%", overflow: "hidden" }}
      >
        {/* Controls */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <button className="btn btn-sm btn-light" onClick={playPrev}>
            <FaStepBackward />
          </button>
          <button className="btn btn-sm btn-light" onClick={playNext}>
            <FaStepForward />
          </button>
        </div>

        {/* Iframe */}
        <div style={{ flexGrow: 1, overflow: "hidden" }}>
          <iframe
            src={currentTrackUrl}
            width="100%"
            height="60"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            frameBorder="0"
            style={{
              borderRadius: "8px",
              width: "100%",
              display: "block"
            }}
            title="Spotify Player"
          ></iframe>
        </div>
      </div>

      {/* Track name */}
      <div className="text-white mt-1 text-center" style={{ fontSize: "0.9rem" }}>
        {currentTrack?.name}
      </div>
    </div>
  );
};

export default MusicPlayer;
