import { useState, useEffect, useRef } from 'react';
import { tmdb } from '../services/tmdb';
import MovieDetailsModal from './MovieDetailsModal';
import './Header.css';

export default function Header() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await tmdb.get('/search/movie', {
          params: { query: query.trim() },
        });
        setSuggestions(response.data.results.slice(0, 5));
        setIsOpen(true);
      } catch (err) {
        console.error('Live search error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectMovie = (id) => {
    setSelectedMovieId(id);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <header className="app-header" ref={searchRef}>
      <div className="search-bar-container">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          placeholder="Search movies, TV shows, genres..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
        />

        {isOpen && suggestions.length > 0 && (
          <div className="search-dropdown">
            {suggestions.map((item) => {
              const year = item.release_date ? item.release_date.split('-')[0] : 'N/A';
              const votePercent = item.vote_average ? Math.round(item.vote_average * 10) : 0;
              
              return (
                <div 
                  key={item.id} 
                  className="search-dropdown-item"
                  onClick={() => handleSelectMovie(item.id)}
                >
                  <div className="dropdown-poster">
                    {item.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} alt={item.title} />
                    ) : (
                      <div className="dropdown-no-image">N/A</div>
                    )}
                  </div>
                  <div className="dropdown-info">
                    <h4>{item.title}</h4>
                    <div className="dropdown-meta">
                      <span>{year}</span>
                      {votePercent > 0 && <span className="dropdown-score">{votePercent}% Match</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MovieDetailsModal 
        movieId={selectedMovieId} 
        onClose={() => setSelectedMovieId(null)} 
      />
    </header>
  );
}