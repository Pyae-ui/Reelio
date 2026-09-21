import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Hero from './components/Hero';
import MediaGrid from './components/MediaGrid';
import Watchlist from './components/Watchlist';
import WatchHistory from './components/WatchHistory';
import './App.css';

function HomeView() {
  return (
    <div className="home-container">
      <Hero />
      <MediaGrid endpoint="/trending/movie/day" title="Trending Movies" showTimeWindow={true} />
    </div>
  );
}

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-viewport">
        <Header />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/movies" element={<MediaGrid endpoint="/movie/popular" title="Popular Movies" />} />
            <Route path="/tv" element={<MediaGrid endpoint="/tv/popular" title="Popular TV Shows" />} />
            <Route path="/trending" element={<MediaGrid endpoint="/trending/all/day" title="Trending Today" showTimeWindow={true} />} />
            
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/history" element={<WatchHistory />} />

            <Route path="/category/action" element={<MediaGrid endpoint="/discover/movie" defaultParams={{ with_genres: 28 }} title="Action Movies" />} />
            <Route path="/category/comedy" element={<MediaGrid endpoint="/discover/movie" defaultParams={{ with_genres: 35 }} title="Comedy Movies" />} />
            <Route path="/category/horror" element={<MediaGrid endpoint="/discover/movie" defaultParams={{ with_genres: 27 }} title="Horror Movies" />} />
            <Route path="/category/romance" element={<MediaGrid endpoint="/discover/movie" defaultParams={{ with_genres: 10749 }} title="Romance Movies" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}