import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Fetch trending movies for the dynamic Hero banner
export const fetchTrendingHeroMovie = async () => {
  try {
    const response = await tmdb.get('/trending/movie/day');
    const movies = response.data.results;
    const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 5));
    return movies[randomIndex];
  } catch (error) {
    console.error('Error fetching hero movie:', error);
    return null;
  }
};