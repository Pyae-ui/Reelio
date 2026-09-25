# Reelio

Reelio is a modern movie and TV discovery app built with React and Vite. It lets users browse trending, popular, and genre-based media, search for titles, and save favorites to a personal watchlist.

## Features

- Trending and popular movie/TV browsing
- Genre-based recommendations
- Live search with suggestions
- Detailed media modal with overview and metadata
- Watchlist saved with local storage
- Responsive dark-themed UI
- Pagination and sorting controls
- TMDB API integration for real movie data

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- TMDB API
- CSS

## Demo

Live demo: https://reelio-lime.vercel.app/

## Screenshots

![Reelio homepage](public/screenshots/Screenshot%202026-09-25%20225328.png)

![Reelio search and browsing view](public/screenshots/Screenshot%202026-09-25%20225409.png)

![Reelio detail modal](public/screenshots/Screenshot%202026-09-25%20225456.png)

![Reelio watchlist view](public/screenshots/Screenshot%202026-09-25%20225526.png)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Pyae-ui/Reelio.git
   cd reelio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your TMDB API key:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

   You can also copy the example file:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the app in your browser at:
   ```bash
   http://localhost:5173
   ```

## Production Build

```bash
npm run build
```

## Project Structure

```bash
src/
  App.jsx
  components/
  services/
  assets/
```

## Notes

This project was built to showcase frontend development skills in a real-world UI and API-driven app. It demonstrates:

- React app architecture
- API integration with TMDB
- Search and filtering flows
- Routing and multi-page browsing experience
- Local persistence for a watchlist
- Responsive dark-mode streaming-inspired UI

## License

This project is open source and available under the MIT License.

## Author

Pyae Sone Tun
