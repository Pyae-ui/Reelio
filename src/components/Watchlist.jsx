import { useState, useEffect } from 'react';
import MovieDetailsModal from './MovieDetailsModal';
import './MediaGrid.css';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const loadWatchlist = () => {
    const saved = JSON.parse(localStorage.getItem('reelio_watchlist') || '[]');
    setWatchlist(saved);
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  // Reload watchlist when modal closes in case items were removed
  const handleCloseModal = () => {
    setSelectedMovieId(null);
    loadWatchlist();
  };

  return (
    <div className="dashboard-view">
      <div className="content-header-row">
        <h2>My Watchlist</h2>
      </div>

      {watchlist.length === 0 ? (
        <div className="loading-state">Your watchlist is empty. Explore movies and add them here!</div>
      ) : (
        <div className="movie-grid">
          {watchlist.map((item) => {
            const votePercent = item.vote_average ? Math.round(item.vote_average * 10) : 0;
            const releaseDate = item.release_date || item.first_air_date || '';
            const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';

            return (
              <div 
                key={item.id} 
                className="movie-card-preview" 
                onClick={() => setSelectedMovieId(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="poster-wrapper">
                  {item.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                      alt={item.title || item.name} 
                    />
                  ) : (
                    <div className="no-image">No Preview</div>
                  )}
                  {votePercent > 0 && (
                    <div className="tmdb-score-badge">
                      <span>{votePercent}<sup>%</sup></span>
                    </div>
                  )}
                </div>
                <div className="movie-info-preview">
                  <h3>{item.title || item.name}</h3>
                  <p>{year}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MovieDetailsModal 
        movieId={selectedMovieId} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}