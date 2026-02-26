import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

function Navbar() {

  const handleLogoClick = () => {
    window.location.href = "/"; 
  };

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link 
          className="logo" 
          to="/" 
          aria-label="Recipe Finder home"
          onClick={handleLogoClick}
        >
          <img 
            src={logo} 
            alt="Recipe Finder Logo" 
            className="navbar-logo" 
          />
          <span className="logo-text">RECIPE FINDER</span>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;