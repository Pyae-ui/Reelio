import { useState, useEffect } from 'react';
import MovieDetailsModal from './MovieDetailsModal';
import './MediaGrid.css';

export default function WatchHistory() {
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('reelio_history') || '[]');
    setHistoryItems(history);
  }, [selectedMovieId]);

  const clearHistory = () => {
    localStorage.removeItem('reelio_history');
    setHistoryItems([]);
  };

  return (
    <div className="dashboard-view">
      <div className="content-header-row">
        <h2>Watch History</h2>
        {historyItems.length > 0 && (
          <button 
            onClick={clearHistory}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '6px 14px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Clear History
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="loading-state">No recently viewed movies. Click on a movie card to start building your history!</div>
      ) : (
        <div className="movie-grid">
          {historyItems.map((item) => {
            const votePercent = item.vote_average ? Math.round(item.vote_average * 10) : 0;
            const releaseDate = item.release_date || item.first_air_date || '';
            const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';

            return (
              <div 
                key={item.id} 
                className="movie-card-preview" 
                onClick={() => setSelectedMovieId(item.id)}
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
        onClose={() => setSelectedMovieId(null)} 
      />
    </div>
  );
}