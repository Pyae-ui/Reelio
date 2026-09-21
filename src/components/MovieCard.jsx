import './MovieCard.css';

function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <div className="movie-poster">
        <img src={movie.image} alt={movie.title} />

        <div className="movie-rating">
          ★ {movie.rating}
        </div>

        <button className="watchlist-icon" type="button" aria-label="Add to watchlist">
          +
        </button>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.year}</p>
      </div>
    </article>
  );
}

export default MovieCard;
