import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tmdb } from '../services/tmdb';
import './Navbar.css';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch live suggestions as the user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await tmdb.get('/search/multi', {
          params: { query: searchQuery, include_adult: false },
        });
        const filtered = (response.data.results || []).filter(
          (item) => (item.media_type === 'movie' || item.media_type === 'tv') && item.adult === false
        );
        setSuggestions(filtered.slice(0, 5)); // Show top 5 suggestions
        setShowDropdown(true);
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
      }
    }, 300); // Debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  const handleSelectSuggestion = (item) => {
    const title = item.title || item.name;
    navigate(`/search?query=${encodeURIComponent(title)}`);
    setShowDropdown(false);
    setSearchQuery('');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          Reelio
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/watchlist">Watchlist</Link>
        </nav>

        <div className="nav-actions" ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit} className="navbar-search-form" style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search movies, TV shows..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
            />

            {showDropdown && suggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                {suggestions.map((item) => {
                  const titleText = item.title || item.name;
                  const year = (item.release_date || item.first_air_date || '').split('-')[0];
                  return (
                    <div 
                      key={`${item.media_type}-${item.id}`} 
                      className="search-suggestion-item"
                      onClick={() => handleSelectSuggestion(item)}
                    >
                      <span className="suggestion-title">{titleText}</span>
                      <span className="suggestion-year">{year ? `(${year})` : ''}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </form>

          <button className="profile-button" type="button">
            Profile
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;