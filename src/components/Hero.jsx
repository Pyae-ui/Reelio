import { useEffect, useState } from 'react';
import { tmdb } from '../services/tmdb';
import './Hero.css';

// Helper to format runtime minutes into hours and minutes (e.g., 142 -> 2h 22m)
function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs ? `${hrs}h ${mins}m` : `${mins}m`;
}

export default function Hero({ onAddToWatchlist, watchlist }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        setLoading(true);
        // Fetch trending movies of the day
        const response = await tmdb.get('/trending/movie/day');
        const results = response.data.results || [];
        
        if (results.length === 0) return;

        // Pick a random movie from the top 5 trending items for variety
        const randomIndex = Math.floor(Math.random() * Math.min(results.length, 5));
        const featuredSummary = results[randomIndex];

        // Fetch full movie details to get runtime, genres, etc.
        const detailsResponse = await tmdb.get(`/movie/${featuredSummary.id}`);
        setMovie(detailsResponse.data);
      } catch (error) {
        console.error('Hero fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovie();
  }, []);

  if (loading || !movie) {
    return (
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <p className="hero-label">LOADING</p>
          <h1>Loading Featured Title...</h1>
        </div>
      </section>
    );
  }

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  // Check if movie is already in the watchlist
  const isInWatchlist = watchlist?.some((item) => item.id === movie.id);

  return (
    <section className="hero">
      <div
        className="hero-background"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(15,15,15,1) 0%, rgba(15,15,15,0.85) 35%, rgba(15,15,15,0.35) 70%, rgba(15,15,15,0.75) 100%),
            linear-gradient(0deg, #0f0f0f 0%, transparent 35%),
            url(${backdrop})
          `,
        }}
      ></div>
      <div className="hero-content">
        <p className="hero-label">FEATURED MOVIE</p>
        <h1>{movie.title || movie.name}</h1>
        <div className="hero-meta">
          <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
          <span>•</span>
          <span>{formatRuntime(movie.runtime)}</span>
          <span>•</span>
          <span className="rating">★ {movie.vote_average?.toFixed(1) ?? 'N/A'}</span>
        </div>
        <p className="hero-description">
          {movie.overview || 'No description available yet.'}
        </p>
        <div className="hero-buttons">
          <button className="primary-button" type="button">
            ▶ Watch Trailer
          </button>
          <button 
            className="secondary-button" 
            type="button"
            onClick={() => onAddToWatchlist && onAddToWatchlist(movie)}
          >
            {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
          </button>
        </div>
      </div>
    </section>
  );
}