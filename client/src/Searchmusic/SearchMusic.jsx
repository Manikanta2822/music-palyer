import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaPlay, FaPlus } from 'react-icons/fa';
import './SearchMusic.css';

export default function SearchMusic() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();
  const { setQueue, setCurrentIndex, setCurrentTrackUrl, setIsPlaying, addToQueue } = useMusic();

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to search music.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/music/search?query=${query}&offset=0`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(response.data);
      setOffset(50);
      setHasMore(response.data.length === 50);
      setError('');
    } catch (err) {
      console.error(err);
      setError("Couldn't fetch songs. Please try again.");
    }
  };

  const loadMoreTracks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/music/search?query=${query}&offset=${offset}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults((prev) => [...prev, ...response.data]);
      setOffset((prev) => prev + 50);
      setHasMore(response.data.length === 50);
    } catch (err) {
      console.error(err);
      setError("Couldn't load more songs.");
    }
  };

  const handlePlayNow = (track) => {
    setQueue([track]);
    setCurrentIndex(0);
    setCurrentTrackUrl(`https://open.spotify.com/embed/track/${track.id}`);
    setIsPlaying(true);
    navigate(`/track/${track.id}`);
  };

  return (
    <div className="search-music-bg min-vh-100 py-5 px-3">
      <h2 className="text-center mb-5 glowing-search-title">
        🔍 Discover Your Favorite Tunes
      </h2>

      <form
        className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-5"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="form-control w-75 w-md-50 search-input"
          placeholder="Type a song name or artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-warning fw-bold px-4">
          <FaSearch className="me-2" />
          Search
        </button>
      </form>

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row g-4">
        {results.map((track, index) => (
          <div className="col-sm-6 col-lg-4" key={track.id}>
            <div className={`card h-100 custom-result-card card-color-${index % 5}`}>
              <img
                src={track.album.images[0]?.url || 'https://via.placeholder.com/300'}
                className="card-img-top"
                alt={track.name}
                style={{ height: '280px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column text-white">
                <h5 className="card-title fw-semibold">{track.name}</h5>
                <p className="card-text text-light">
                  {track.artists.map((artist) => artist.name).join(', ')}
                </p>
                <div className="d-flex gap-2 mt-auto">
                  <button
                    className="btn btn-light fw-semibold flex-grow-1"
                    onClick={() => handlePlayNow(track)}
                  >
                    <FaPlay className="me-2" />
                    Play Now
                  </button>
                  <button
                    className="btn btn-outline-light fw-semibold"
                    onClick={() => addToQueue(track)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <button className="btn btn-outline-warning fw-bold px-5 py-2" onClick={loadMoreTracks}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
