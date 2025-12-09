import { NavLink } from "react-router-dom";

// Navigationsleiste der Anwendung.
function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `f1-nav-link${isActive ? " is-active" : ""}`;

  // Nutzt NavLink, um aktive Navigationspunkte visuell hervorzuheben.
  // Die Links werden später dynamisch an die Benutzerrolle angepasst.

  return (
    <>
      <header className="f1-navbar">
        <div className="f1-brand">
          <span className="f1-brand-mark">F1</span>
          <div className="f1-brand-text">
            <span className="f1-brand-title">Championship</span>
            <span className="f1-brand-subtitle">Race Center</span>
          </div>
        </div>

        <nav className="f1-nav-links">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>
          <NavLink to="/player" className={navLinkClass}>
            Player
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </nav>
      </header>
      <div className="f1-track-line" />
    </>
  );
}

export default Navbar;
