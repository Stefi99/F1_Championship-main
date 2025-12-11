// Öffentliche Startseite ohne Login.
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrackVisual } from "../data/tracks";
import { getAllRaces } from "../services/raceService.js";
import { ApiError } from "../utils/api.js";
import { getErrorMessage } from "../utils/errorHandler.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

function HomePage() {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lädt Rennen vom Backend
  useEffect(() => {
    const fetchRaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const racesData = await getAllRaces();
        setRaces(racesData);
      } catch (err) {
        console.error("Fehler beim Laden der Rennen:", err);
        setError(err);
        setRaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Statistische Zusammenfassung aller Rennen
  const stats = useMemo(() => {
    const planned = races.filter((race) => race.status === "open").length;
    const tipping = races.filter((race) => race.status === "voting").length;
    const closed = races.filter((race) => race.status === "closed").length;
    return {
      total: races.length,
      planned,
      tipping,
      closed,
    };
  }, [races]);

  // UI-Labels für Status und Wetteranzeigen.
  const statusLabel = {
    open: "Geplant",
    voting: "Tippen möglich",
    closed: "Ergebnis steht",
  };

  const weatherLabel = {
    sunny: "Sonne",
    cloudy: "Wolken",
    rain: "Regen",
  };

  // Ermittelt die nächsten anstehenden (nicht geschlossenen) Rennen
  const upcomingRaces = useMemo(() => {
    const parseDate = (value) => (value ? new Date(value) : null);
    return [...races]
      .filter((race) => race.status !== "closed")
      .sort((a, b) => {
        const da = parseDate(a.date);
        const db = parseDate(b.date);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return da - db;
      })
      .slice(0, 3);
  }, [races]);

  // Filtert Rennen nach Status zur Darstellung in Info-Karten und CTA-Bereichen.
  const votingRaces = useMemo(
    () => races.filter((race) => race.status === "voting"),
    [races]
  );

  const plannedRaces = useMemo(
    () => races.filter((race) => race.status === "open"),
    [races]
  );

  // Aufbau der Home-Page
  // Loading-State: Zeige Spinner während Daten geladen werden
  if (loading) {
    return (
      <div className="home-page">
        <LoadingSpinner message="Rennen werden geladen..." />
      </div>
    );
  }

  // Error-State: Zeige Fehlermeldung wenn Daten nicht geladen werden konnten
  if (error) {
    return (
      <div className="home-page">
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          <ErrorMessage error={error} />
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              background: "var(--f1-red, #e10600)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-text">
          <p className="home-kicker">Offizielle F1 Championship</p>
          <h1>Ranglisten, Tipps und Rennkalender in einem Hub</h1>
          <p className="home-lead">
            Hol dir den schnellen Überblick: aktuelle Rangliste, offene
            Tippfenster und geplante Rennen. Alles im gleichen Look wie das
            Admin-Dashboard.
          </p>
          <div className="home-cta-row">
            <button
              type="button"
              onClick={() => navigate("/player/leaderboard")}
            >
              Zur Rangliste
            </button>
            <button
              type="button"
              className="home-ghost-btn"
              onClick={() => navigate("/player/races")}
            >
              Zu den Rennen
            </button>
          </div>
          <div className="home-pill-row">
            <span className="home-pill">Season Center</span>
            <span className="home-pill muted">Live gepflegt vom Admin</span>
          </div>
        </div>

        <div className="home-hero-stats">
          <div className="home-stat">
            <span>Rennen gelistet</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="home-stat">
            <span>Tippen offen</span>
            <strong>{stats.tipping}</strong>
          </div>
          <div className="home-stat">
            <span>Geplant</span>
            <strong>{stats.planned}</strong>
          </div>
          <div className="home-stat">
            <span>Abgeschlossen</span>
            <strong>{stats.closed}</strong>
          </div>
        </div>
      </section>

      <section className="home-feature-grid">
        <article className="home-feature-card">
          <p className="home-eyebrow">Rangliste</p>
          <h2>Wer führt die Saison an?</h2>
          <p>
            Öffentliche Leaderboard-Seite mit allen Punkten und Platzierungen.
          </p>
          <div className="home-feature-actions">
            <button
              type="button"
              onClick={() => navigate("/player/leaderboard")}
            >
              Rangliste öffnen
            </button>
            <button
              type="button"
              className="home-ghost-btn"
              onClick={() => navigate("/login")}
            >
              Anmelden
            </button>
          </div>
        </article>

        <article className="home-feature-card secondary">
          <p className="home-eyebrow">Tipps</p>
          <h2>Direkt ins Tippfenster</h2>
          <p>
            Sieh dir die Rennen an, bei denen aktuell Tipps erlaubt sind, und
            lege los.
          </p>
          <div className="home-pills-list">
            {votingRaces.length === 0 ? (
              <span className="home-chip muted">Kein Tippfenster offen</span>
            ) : (
              votingRaces.map((race) => (
                <span key={race.id} className="home-chip">
                  {race.track || "Rennen"}
                  {" \u00b7 "}
                  {race.date || "Datum folgt"}
                </span>
              ))
            )}
          </div>
          <div className="home-feature-actions">
            <button type="button" onClick={() => navigate("/player/races")}>
              Rennen ansehen
            </button>
            <button
              type="button"
              className="home-ghost-btn"
              onClick={() =>
                votingRaces.length > 0
                  ? navigate(`/player/race/${votingRaces[0].id}/tips`)
                  : navigate("/player/races")
              }
            >
              Jetzt tippen
            </button>
          </div>
        </article>
      </section>

      <section className="home-races-section">
        <div className="home-section-head">
          <div>
            <p className="home-eyebrow">Kalender</p>
            <h2>Anstehende Rennen</h2>
            <p className="home-lead">
              Geplante Events und aktive Tippfenster mit Streckenfarben und
              Status.
            </p>
          </div>
          <button
            type="button"
            className="home-ghost-btn"
            onClick={() => navigate("/admin/races")}
          >
            Rennen verwalten
          </button>
        </div>

        {upcomingRaces.length === 0 ? (
          <div className="home-empty">
            <h3>Noch keine Rennen gepflegt</h3>
            <p>
              Lege im Admin-Bereich die ersten Events an, damit sie hier
              erscheinen.
            </p>
          </div>
        ) : (
          <div className="home-race-grid">
            {upcomingRaces.map((race) => {
              const visual = getTrackVisual(race.track);
              return (
                <article
                  key={race.id}
                  className="home-race-card"
                  style={{
                    backgroundImage: `${visual.pattern}, ${visual.gradient}`,
                  }}
                >
                  <div className="home-race-overlay" />
                  <div className="home-race-top">
                    <span className="home-track-code">
                      {visual.code || "F1"}
                    </span>
                    <span
                      className={`home-status-chip status-${
                        race.status || "open"
                      }`}
                    >
                      {statusLabel[race.status] || "Geplant"}
                    </span>
                  </div>
                  <div className="home-race-body">
                    <div className="home-race-title">
                      <p>{visual.label || race.track || "Strecke"}</p>
                      <h3>{race.track || "Rennen folgt"}</h3>
                    </div>
                    <div className="home-race-meta">
                      <span>{race.date || "Datum folgt"}</span>
                      <span className="home-dot">{"\u00b7"}</span>
                      <span>
                        {weatherLabel[race.weather] || "Wetter folgt"}
                      </span>
                    </div>
                    <div className="home-race-actions">
                      <button
                        type="button"
                        onClick={() =>
                          race.status === "voting"
                            ? navigate(`/player/race/${race.id}/tips`)
                            : navigate("/player/races")
                        }
                      >
                        {race.status === "voting" ? "Tippen" : "Details"}
                      </button>
                      <button
                        type="button"
                        className="home-ghost-btn"
                        onClick={() => navigate("/player/leaderboard")}
                      >
                        Rangliste
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="home-summary">
        <div className="home-summary-card">
          <p className="home-eyebrow">Kurz gesagt</p>
          <h3>Planung</h3>
          <p>
            {plannedRaces.length === 0
              ? "Noch keine geplanten Rennen eingetragen."
              : `${plannedRaces.length} Rennen in Planung, ${votingRaces.length} Tippfenster offen.`}
          </p>
        </div>
        <div className="home-summary-card">
          <p className="home-eyebrow">Results</p>
          <h3>Abgeschlossen</h3>
          <p>
            {stats.closed === 0
              ? "Noch keine offiziellen Resultate."
              : `${stats.closed} Rennen bereits mit Ergebnissen geschlossen.`}
          </p>
        </div>
        <div className="home-summary-card">
          <p className="home-eyebrow">Call to action</p>
          <h3>Jetzt einsteigen</h3>
          <p>
            Logge dich ein, um Tipps abzugeben oder die Admin-Tools zu nutzen.
          </p>
          <div className="home-summary-actions">
            <button type="button" onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              type="button"
              className="home-ghost-btn"
              onClick={() => navigate("/register")}
            >
              Registrieren
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
