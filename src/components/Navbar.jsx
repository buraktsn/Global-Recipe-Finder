import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Navbar({ favCount = 0 }) {
  const { lang, toggle, t } = useLanguage();

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link className="logo" to="/" aria-label={`${t.siteName} home`}>
          <svg
            className="logo-svg"
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#be8c3f"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Fork — tines */}
            <line x1="6"  y1="2" x2="6"  y2="7" />
            <line x1="8"  y1="2" x2="8"  y2="7" />
            <line x1="10" y1="2" x2="10" y2="7" />
            {/* Fork — tine curve + handle */}
            <path d="M6 7 Q8 11 10 7" />
            <line x1="8" y1="11" x2="8" y2="22" />
            {/* Knife — handle */}
            <line x1="16" y1="2" x2="16" y2="22" />
            {/* Knife — blade */}
            <path d="M16 2 C19 3 20 6 20 9 L16 9" />
          </svg>
          <span className="logo-text">{t.siteName}</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>{t.navbar.explore}</NavLink>
          <NavLink to="/favorites">
            {t.navbar.favorites}
            {favCount > 0 && <span className="fav-badge">{favCount}</span>}
          </NavLink>

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
