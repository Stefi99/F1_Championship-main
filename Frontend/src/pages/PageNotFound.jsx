// Fallback-Komponente für alle nicht definierten Routen.
import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-not-found">
      <div className="page-not-found-content">
        <h1 className="page-not-found-title">404</h1>
        <h2 className="page-not-found-subtitle">Seite nicht gefunden</h2>
        <p className="page-not-found-text">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="page-not-found-actions">
          <button
            type="button"
            className="page-not-found-button"
            onClick={() => navigate("/")}
          >
            Zur Startseite
          </button>
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
