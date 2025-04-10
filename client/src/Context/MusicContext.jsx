// context/MusicContext.js
import React, { createContext, useContext, useState } from "react";

const MusicContext = createContext();
export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrackUrl, setCurrentTrackUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const updateTrackUrl = (track) => {
    setCurrentTrackUrl(`https://open.spotify.com/embed/track/${track.id}`);
  };

  const playTrackAt = (index) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      updateTrackUrl(queue[index]);
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      playTrackAt(currentIndex + 1);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      playTrackAt(currentIndex - 1);
    }
  };

  const addToQueue = (track) => {
    setQueue((prevQueue) => [...prevQueue, track]);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <MusicContext.Provider
      value={{
        queue,
        setQueue,
        currentIndex,
        setCurrentIndex,
        currentTrack: queue[currentIndex],
        currentTrackUrl,
        setCurrentTrackUrl,
        isPlaying,
        setIsPlaying,
        playNext,
        playPrev,
        playTrackAt,
        addToQueue,
        togglePlayPause,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
