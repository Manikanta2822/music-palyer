import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');

  const fetchSongs = async (reset = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to see top songs.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/music/search?query=top&offset=${reset ? 0 : offset}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (reset) {
        setSongs(response.data);
        setOffset(50);
      } else {
        setSongs((prev) => [...prev, ...response.data]);
        setOffset((prev) => prev + 50);
      }
      setHasMore(response.data.length === 50);
      setError('');
    } catch (err) {
      console.error(err);
      setError("Couldn't load songs. Please try again.");
    }
  };

  useEffect(() => {
    fetchSongs(true);
  }, []);

  return (
    <div className="home-bg min-vh-100 py-5 px-3">
      <h2 className="text-center mb-5 glowing-text">
        🎶 Top Trending Songs Just For You
      </h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row g-4">
        {songs.map((track, index) => (
          <div className="col-sm-6 col-lg-4" key={track.id}>
            <div className={`card h-100 custom-result-card card-color-${index % 5}`}>
              <img
                src={track.album?.images[0]?.url || 'https://via.placeholder.com/300'}
                className="card-img-top"
                alt={track.name}
                style={{ height: '280px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column text-white">
                <h5 className="card-title fw-semibold">{track.name}</h5>
                <p className="card-text text-light">
                  {track.artists?.map((artist) => artist.name).join(', ')}
                </p>
                <Link to={`/track/${track.id}`} className="btn btn-light fw-bold mt-auto">
                  ▶️ Play Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-warning fw-bold px-5 py-2"
            onClick={() => fetchSongs(false)}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
