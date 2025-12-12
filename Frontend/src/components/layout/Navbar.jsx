/**
 * Navbar - Navigationsleiste der Anwendung
 *
 * Zeigt die Hauptnavigation mit Logo, Navigationslinks und Login/Logout-Funktionalität.
 * Die Navigation passt sich dynamisch an den Authentifizierungsstatus an:
 * - Nicht eingeloggt: Zeigt "Login"-Link
 * - Eingeloggt: Zeigt "Logout"-Button
 *
 * Aktive Navigationspunkte werden visuell hervorgehoben.
 */
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.js";

function Navbar() {
  // Authentifizierungsstatus und Logout-Funktion aus dem Context holen
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * CSS-Klassen-Funktion für NavLink-Komponenten
   * Fügt die Klasse "is-active" hinzu, wenn der Link aktiv ist
   *
   * @param {Object} param0 - NavLink-Props
   * @param {boolean} param0.isActive - Ob der Link aktuell aktiv ist
   * @returns {string} CSS-Klassen-String
   */
  const navLinkClass = ({ isActive }) =>
    `f1-nav-link${isActive ? " is-active" : ""}`;

  /**
   * Logout-Handler: Meldet den Benutzer ab und navigiert zur Homepage
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="f1-navbar">
        {/* Logo und Markenname */}
        <div className="f1-brand">
          <span className="f1-brand-mark">F1</span>
          <div className="f1-brand-text">
            <span className="f1-brand-title">Championship</span>
            <span className="f1-brand-subtitle">Race Center</span>
          </div>
        </div>

        {/* Navigationslinks */}
        <nav className="f1-nav-links">
          {/* Home-Link - end prop sorgt dafür, dass nur exakt "/" als aktiv gilt */}
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          {/* Bedingte Anzeige: Login oder Logout je nach Authentifizierungsstatus */}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="f1-nav-link">
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}

          {/* Player-Bereich Link */}
          <NavLink to="/player" className={navLinkClass}>
            Player
          </NavLink>

          {/* Admin-Bereich Link */}
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </nav>
      </header>

      {/* Dekorative Linie unter der Navbar */}
      <div className="f1-track-line" />
    </>
  );
}

export default Navbar;
