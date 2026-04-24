import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar({ favCount = 0 }) {
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link className="logo" to="/" aria-label="Recipe Finder home">
          <img src={logo} alt="Recipe Finder Logo" className="navbar-logo" />
          <span className="logo-text">RECIPE FINDER</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Explore</NavLink>
          <NavLink to="/favorites">
            ♥ Favorites
            {favCount > 0 && <span className="fav-badge">{favCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
