import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot"></span>
        <span className="brand-name">REELIO</span>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">BROWSE</p>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Home
        </NavLink>
        <NavLink to="/movies" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Movies
        </NavLink>
        <NavLink to="/tv" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          TV Shows
        </NavLink>
        <NavLink to="/trending" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Trending
        </NavLink>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">MY LIBRARY</p>
        <NavLink to="/watchlist" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          My List
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          History
        </NavLink>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">CATEGORIES</p>
        <NavLink to="/category/action" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Action
        </NavLink>
        <NavLink to="/category/comedy" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Comedy
        </NavLink>
        <NavLink to="/category/horror" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Horror
        </NavLink>
        <NavLink to="/category/romance" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Romance
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;