/**
 * PageNotFound - Fallback-Komponente für alle nicht definierten Routen
 *
 * Wird angezeigt, wenn der Benutzer eine Route aufruft, die nicht existiert.
 * Zeigt eine benutzerfreundliche 404-Fehlerseite mit:
 * - Fehlercode (404)
 * - Erklärungstext
 * - Navigationsoptionen (Zur Startseite, Zurück)
 *
 * Diese Komponente wird im Router als Catch-All-Route (*) verwendet.
 */
import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-not-found">
      <div className="page-not-found-content">
        {/* Fehlercode */}
        <h1 className="page-not-found-title">404</h1>

        {/* Überschrift */}
        <h2 className="page-not-found-subtitle">Seite nicht gefunden</h2>

        {/* Erklärungstext */}
        <p className="page-not-found-text">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>

        {/* Navigations-Buttons */}
        <div className="page-not-found-actions">
          {/* Button: Zur Startseite navigieren */}
          <button
            type="button"
            className="page-not-found-button"
            onClick={() => navigate("/")}
          >
            Zur Startseite
          </button>

          {/* Button: Zur vorherigen Seite zurück (Browser-History) */}
          <button
            type="button"
            className="page-not-found-button page-not-found-button-secondary"
            onClick={() => navigate(-1)}
          >
            Zurück
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
