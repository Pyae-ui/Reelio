import { useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';
import './MovieDetailsModal.css';

export default function MovieDetailsModal({ movieId, onClose, mediaType = 'movie' }) {
  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      setIsPlayingTrailer(false);
      try {
        // Use the exact mediaType passed (defaulting safely to 'movie')
        const type = mediaType === 'tv' ? 'tv' : 'movie';

        const [res, creditsRes, videosRes] = await Promise.all([
          tmdb.get(`/${type}/${movieId}`),
          tmdb.get(`/${type}/${movieId}/credits`),
          tmdb.get(`/${type}/${movieId}/videos`)
        ]);

        if (!isMounted) return;

        const data = res.data;
        data.media_type = type;
        setMedia(data);
        setCast(creditsRes.data.cast ? creditsRes.data.cast.slice(0, 8) : []);

        // Find official YouTube trailer
        const videos = videosRes.data.results || [];
        const officialTrailer = videos.find(
          (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        setTrailerKey(officialTrailer ? officialTrailer.key : null);

        // Check watchlist
        const watchlist = JSON.parse(localStorage.getItem('reelio_watchlist') || '[]');
        setIsWatchlisted(watchlist.some((item) => item.id === data.id));

        // Save to History
        const history = JSON.parse(localStorage.getItem('reelio_history') || '[]');
        const filteredHistory = history.filter((item) => item.id !== data.id);
        const updatedHistory = [data, ...filteredHistory].slice(0, 20);
        localStorage.setItem('reelio_history', JSON.stringify(updatedHistory));

      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [movieId, mediaType]);

  const toggleWatchlist = () => {
    if (!media) return;
    const watchlist = JSON.parse(localStorage.getItem('reelio_watchlist') || '[]');
    
    if (isWatchlisted) {
      const updated = watchlist.filter((item) => item.id !== media.id);
      localStorage.setItem('reelio_watchlist', JSON.stringify(updated));
      setIsWatchlisted(false);
    } else {
      watchlist.push(media);
      localStorage.setItem('reelio_watchlist', JSON.stringify(watchlist));
      setIsWatchlisted(true);
    }
  };

  if (!movieId) return null;

  const backdropUrl = media?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${media.backdrop_path}` 
    : '';

  const votePercent = media?.vote_average ? Math.round(media.vote_average * 10) : 0;
  const releaseDate = media?.release_date || media?.first_air_date || '';
  const releaseYear = releaseDate ? releaseDate.split('-')[0] : '';
  const titleText = media?.title || media?.name || '';
  const runtime = media?.runtime || (media?.episode_run_time ? media.episode_run_time[0] : null);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        {loading ? (
          <div className="modal-loading">Loading details...</div>
        ) : media ? (
          <>
            <div className="modal-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
              <div className="modal-hero-gradient"></div>
              
              {isPlayingTrailer && trailerKey ? (
                <div className="trailer-embed-container">
                  <iframe 
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                  <button className="close-trailer-btn" onClick={() => setIsPlayingTrailer(false)}>
                    &times; Back to Details
                  </button>
                </div>
              ) : (
                <div className="modal-hero-info">
                  <h2>{titleText}</h2>
                  <div className="modal-meta">
                    {releaseYear && <span>{releaseYear}</span>}
                    {runtime && <span>{releaseYear ? '• ' : ''}{runtime} min</span>}
                    {votePercent > 0 && <span className="modal-score">{(releaseYear || runtime) ? '• ' : ''}{votePercent}% Score</span>}
                  </div>
                </div>
              )}
            </div>

            {!isPlayingTrailer && (
              <div className="modal-body">
                {media.tagline && <p className="modal-tagline">{media.tagline}</p>}
                <h3>Overview</h3>
                <p className="modal-overview">{media.overview}</p>

                <div className="modal-genres">
                  {media.genres?.map((genre) => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>

                {cast.length > 0 && (
                  <div className="modal-cast-section">
                    <h3>Top Cast</h3>
                    <div className="cast-list">
                      {cast.map((person) => (
                        <div key={person.id} className="cast-card">
                          <div className="cast-avatar">
                            {person.profile_path ? (
                              <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} />
                            ) : (
                              <div className="cast-no-image">No Photo</div>
                            )}
                          </div>
                          <span className="cast-name">{person.name}</span>
                          <span className="cast-character">{person.character}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  {trailerKey ? (
                    <button 
                      onClick={() => setIsPlayingTrailer(true)} 
                      className="trailer-btn"
                    >
                      ▶ Watch Trailer
                    </button>
                  ) : (
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(titleText + ' official trailer')} `} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="trailer-btn"
                    >
                      Search Trailer
                    </a>
                  )}

                  <button 
                    onClick={toggleWatchlist} 
                    className={`watchlist-toggle-btn ${isWatchlisted ? 'remove' : 'add'}`}
                  >
                    {isWatchlisted ? 'Remove from Watchlist' : '+ Add to Watchlist'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="modal-loading">Failed to load details.</div>
        )}
      </div>
    </div>
  );
}