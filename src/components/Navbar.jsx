import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';

function Navbar({ favCount = 0 }) {
  const { lang, toggle, t } = useLanguage();
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link className="logo" to="/" aria-label={`${t.siteName} home`}>
          <img src={logo} alt="CookLand Logo" className="navbar-logo" />
          <span className="logo-text">{t.siteName}</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            {t.navbar.explore}
          </Link>
          <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>
            {t.navbar.favorites}
            {favCount > 0 && <span className="fav-badge">{favCount}</span>}
          </Link>

          <div className="lang-toggle">
            <button
              className={`lang-btn${lang === 'tr' ? ' lang-btn--active' : ''}`}
              onClick={toggle}
              aria-label="Türkçe"
            >
              TR
            </button>
            <button
              className={`lang-btn${lang === 'en' ? ' lang-btn--active' : ''}`}
              onClick={toggle}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
