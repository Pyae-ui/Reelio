import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdb } from '../services/tmdb';
import MovieDetailsModal from './MovieDetailsModal';
import './MediaGrid.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState({ id: null, type: 'movie' });

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    let isMounted = true;
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await tmdb.get('/search/multi', {
          params: { query, include_adult: false, page: currentPage },
        });

        if (isMounted) {
          const rawResults = response.data.results || [];
          const filtered = rawResults.filter((item) => {
            const isCorrectType = item.media_type === 'movie' || item.media_type === 'tv';
            const isNotAdult = item.adult === false;
            return isCorrectType && isNotAdult;
          });

          setResults(filtered);
          setTotalPages(Math.min(response.data.total_pages || 1, 500));
        }
      } catch (err) {
        console.error('Search error:', err);
        if (isMounted) {
          setError('Failed to fetch search results. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();
    return () => {
      isMounted = false;
    };
  }, [query, currentPage]);

  return (
    <div className="dashboard-view">
      <div className="content-header-row">
        <h2>Search Results for &ldquo;{query}&rdquo;</h2>
      </div>

      {loading ? (
        <div className="loading-state">Searching TMDB library...</div>
      ) : error ? (
        <div className="loading-state" style={{ color: '#ef4444' }}>{error}</div>
      ) : results.length === 0 ? (
        <div className="loading-state">No results found matching &ldquo;{query}&rdquo;.</div>
      ) : (
        <>
          <div className="movie-grid">
            {results.map((item) => {
              const votePercent = item.vote_average ? Math.round(item.vote_average * 10) : 0;
              const releaseDate = item.release_date || item.first_air_date || '';
              const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
              const titleText = item.title || item.name;
              const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

              return (
                <div 
                  key={`${mediaType}-${item.id}`} 
                  className="movie-card-preview" 
                  onClick={() => setSelectedMedia({ id: item.id, type: mediaType })}
                >
                  <div className="poster-wrapper">
                    {item.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                        alt={titleText} 
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
                    <h3>{titleText}</h3>
                    <p>{year}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination-bar">
              <button 
                disabled={currentPage === 1} 
                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="page-btn"
              >
                &larr; Prev
              </button>

              <span className="page-info">
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>

              <button 
                disabled={currentPage >= totalPages} 
                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="page-btn"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}

      <MovieDetailsModal 
        movieId={selectedMedia.id} 
        mediaType={selectedMedia.type}
        onClose={() => setSelectedMedia({ id: null, type: 'movie' })} 
      />
    </div>
  );
}