import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar({ favCount = 0 }) {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link className="logo" to="/" aria-label="COOKLAND home">
          <img src={logo} alt="CookLand Logo" className="navbar-logo" />
          <span className="logo-text">COOKLAND</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Explore
          </Link>
          <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>
            ♥ Favorites
            {favCount > 0 && <span className="fav-badge">{favCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
