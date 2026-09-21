import { useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';
import MovieDetailsModal from './MovieDetailsModal';
import './MediaGrid.css';

export default function MediaGrid({ endpoint, title, showTimeWindow = false, defaultParams = {} }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState('day');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState({ id: null, type: 'movie' });

  // Extract primitive genre ID to reliably track category switches
  const genreId = defaultParams?.with_genres;

  // Reset to page 1 immediately whenever the genre changes
  useEffect(() => {
    setCurrentPage(1);
  }, [genreId]);

  useEffect(() => {
    let isMounted = true;
    const fetchMedia = async () => {
      setLoading(true);
      try {
        let finalEndpoint = endpoint;
        
        if (showTimeWindow) {
          finalEndpoint = endpoint.includes('movie') 
            ? `/trending/movie/${timeWindow}` 
            : `/trending/all/${timeWindow}`;
        }

        // TMDB gives 20 items per page. To show 21, fetch currentPage and currentPage + 1, then slice 21.
        const page1Params = { ...defaultParams, page: (currentPage * 2) - 1 };
        const page2Params = { ...defaultParams, page: currentPage * 2 };

        if (!showTimeWindow) {
          page1Params.sort_by = sortBy;
          page2Params.sort_by = sortBy;
        }

        const [res1, res2] = await Promise.all([
          tmdb.get(finalEndpoint, { params: page1Params }),
          tmdb.get(finalEndpoint, { params: page2Params })
        ]);

        if (isMounted) {
          const combinedResults = [
            ...(res1.data.results || []),
            ...(res2.data.results || [])
          ];

          // Slice precisely to 21 movies
          setItems(combinedResults.slice(0, 21));
          
          // Adjust total pages count accounting for double-fetching
          const maxTmdbPages = res1.data.total_pages || 1;
          setTotalPages(Math.min(Math.ceil(maxTmdbPages / 2), 250));
        }
      } catch (error) {
        console.error('Error fetching media grid:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMedia();
    return () => {
      isMounted = false;
    };
  }, [endpoint, timeWindow, sortBy, showTimeWindow, currentPage, genreId]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleTimeWindowChange = (window) => {
    setTimeWindow(window);
    setCurrentPage(1);
  };

  return (
    <div className="dashboard-view">
      <div className="content-header-row">
        <h2>{title}</h2>
        
        <div className="grid-controls">
          {showTimeWindow ? (
            <div className="time-window-toggle">
              <button 
                className={timeWindow === 'day' ? 'active' : ''} 
                onClick={() => handleTimeWindowChange('day')}
              >
                Today
              </button>
              <button 
                className={timeWindow === 'week' ? 'active' : ''} 
                onClick={() => handleTimeWindowChange('week')}
              >
                This Week
              </button>
            </div>
          ) : (
            <select 
              className="sort-dropdown"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Newest Releases</option>
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading cinematic library...</div>
      ) : items.length === 0 ? (
        <div className="loading-state">No items found.</div>
      ) : (
        <>
          <div className="movie-grid">
            {items.map((item) => {
              const votePercent = item.vote_average ? Math.round(item.vote_average * 10) : 0;
              const releaseDate = item.release_date || item.first_air_date || '';
              const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
              const titleText = item.title || item.name;
              const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

              return (
                <div 
                  key={`${item.id}-${currentPage}`} 
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

          {/* Pagination Bar */}
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