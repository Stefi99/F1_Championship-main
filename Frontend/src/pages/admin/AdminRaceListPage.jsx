import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriverTeam, TEAM_CLASS_MAP } from "../../data/drivers";
import { getTrackVisual } from "../../data/tracks";
import { getAllRaces, deleteRace } from "../../services/raceService.js";
import { ApiError } from "../../utils/api.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

// Seite für die Verwaltung aller Rennen (Admin-Bereich)
function AdminRaceListPage() {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Team-Informationen für Fahrerchips in der Detailansicht
  const teamClass = (driverName) => {
    const team = getDriverTeam(driverName);
    return TEAM_CLASS_MAP[team] || "team-default";
  };

  const teamLabel = (driverName) =>
    getDriverTeam(driverName) || "Team unbekannt";

  // Mapping-Tabellen für die Übersetzung technischer Werte
  const statusLabel = {
    open: "Offen",
    voting: "Tippen möglich",
    closed: "Geschlossen",
  };

  const weatherLabel = {
    sunny: "Sonne",
    cloudy: "Wolkig",
    rain: "Regen",
  };

  const tyreLabel = {
    soft: "Soft",
    medium: "Medium",
    hard: "Hard",
  };

  // Lädt alle Rennen vom Backend
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

  // Berechnet Statistiken (Anzahl offen, voting, geschlossen)
  const stats = useMemo(() => {
    const total = races.length;
    const openCount = races.filter((race) => race.status === "open").length;
    const votingCount = races.filter((race) => race.status === "voting").length;
    const closedCount = races.filter((race) => race.status === "closed").length;
    return { total, openCount, votingCount, closedCount };
  }, [races]);

  // Löscht ein Rennen nach Bestätigung durch den Benutzer.
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Rennen wirklich löschen?");
    if (!confirmDelete) return;

    try {
      await deleteRace(id);
      // Rennen aus lokaler Liste entfernen
      setRaces((prev) => prev.filter((race) => String(race.id) !== String(id)));
    } catch (err) {
      console.error("Fehler beim Löschen des Rennens:", err);
      if (err instanceof ApiError) {
        alert(err.message || "Fehler beim Löschen des Rennens.");
      } else {
        alert("Netzwerkfehler oder Server nicht erreichbar.");
      }
    }
  };

  // Öffnet oder schließt die Detailansicht einer Rennkarte
  const toggleExpand = (id) =>
    setExpandedId((prev) => (String(prev) === String(id) ? null : id));

  // Erzeugt die Hintergrund-Styles für die Track-Karte
  const mediaStyle = (visual) => {
    const layers = [
      visual.pattern,
      visual.image ? `url(${visual.image})` : null,
      visual.gradient,
    ].filter(Boolean);
    return {
      backgroundImage: layers.join(", "),
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  // Loading-State
  if (loading) {
    return (
      <div className="races-admin-page">
        <LoadingSpinner message="Rennen werden geladen..." />
      </div>
    );
  }

  // Darstellung der kompletten Rennen-Übersicht
  return (
    <div className="races-admin-page">
      {error && (
        <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
          <ErrorMessage error={error} />
        </div>
      )}
      <header className="races-hero">
        <div className="races-hero-copy">
          <p className="admin-eyebrow">Rennen</p>
          <h1>Rennen verwalten</h1>
          <p className="admin-sub">
            Übersichtliche Karten mit Streckenplatzhalter, Status und schnellen
            Aktionen. Alles in einem Stil wie Dashboard und Renn-Formular.
          </p>
          <div className="races-hero-actions">
            <button onClick={() => navigate("/admin/races/new")}>
              Neues Rennen anlegen
            </button>
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={() => navigate("/admin/results")}
            >
              Offizielle Ergebnisse
            </button>
          </div>
        </div>
        <div className="races-hero-stats">
          <div className="races-stat">
            <strong>{stats.total}</strong>
            <span>geplante Rennen</span>
          </div>
          <div className="races-stat">
            <strong>{stats.openCount + stats.votingCount}</strong>
            <span>offen / tippen</span>
          </div>
          <div className="races-stat">
            <strong>{stats.closedCount}</strong>
            <span>geschlossen</span>
          </div>
        </div>
      </header>

      {races.length === 0 ? (
        <div className="races-empty">
          <h2>Noch keine Rennen erfasst</h2>
          <p>
            Lege das erste Event an oder springe direkt zu den offiziellen
            Ergebnissen.
          </p>
          <div className="races-empty-actions">
            <button onClick={() => navigate("/admin/races/new")}>
              Neues Rennen anlegen
            </button>
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={() => navigate("/admin/results")}
            >
              Offizielle Ergebnisse
            </button>
          </div>
        </div>
      ) : (
        <div className="race-card-grid">
          {races.map((race) => {
            const isExpanded = String(expandedId) === String(race.id);
            const hasOrder = (race.resultsOrder || []).length > 0;
            const driverList = race.drivers || [];
            const trackVisual = getTrackVisual(race.track);
            return (
              <article
                key={race.id}
                className={`race-card ${isExpanded ? "is-open" : ""}`}
              >
                <div
                  className="race-card-media"
                  style={mediaStyle(trackVisual)}
                  aria-hidden="true"
                >
                  <div className="race-media-top">
                    <span className="race-tag">{trackVisual.code || "F1"}</span>
                    <span
                      className={`race-status-chip race-status-${
                        race.status || "open"
                      }`}
                    >
                      {statusLabel[race.status] || "Offen"}
                    </span>
                  </div>
                  <div className="race-media-bottom">
                    <p className="race-media-label">
                      {trackVisual.label || race.track || "Strecke"}
                    </p>
                    <span className="race-media-track">
                      {race.track || "Strecke folgt"}
                    </span>
                  </div>
                </div>

                <div className="race-card-body">
                  <div className="race-meta-row">
                    <div className="race-meta-tile">
                      <span>Datum</span>
                      <strong>{race.date || "Noch offen"}</strong>
                    </div>
                    <div className="race-meta-tile">
                      <span>Wetter</span>
                      <strong>{weatherLabel[race.weather] || "-"}</strong>
                    </div>
                    <div className="race-meta-tile">
                      <span>Reifen</span>
                      <strong>{tyreLabel[race.tyres] || "-"}</strong>
                    </div>
                  </div>

                  <div className="race-card-actions">
                    <button
                      type="button"
                      className="race-ghost-btn"
                      onClick={() => toggleExpand(race.id)}
                    >
                      {isExpanded ? "Details ausblenden" : "Renn-Details"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/races/${race.id}/edit`)}
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      className="race-danger-btn"
                      onClick={() => handleDelete(race.id)}
                    >
                      Löschen
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="race-card-details">
                      <div className="race-detail-block">
                        <p className="race-detail-title">Ergebnisse</p>
                        <div className="race-detail-content">
                          <strong>Ergebnisliste:</strong>{" "}
                          {hasOrder ? (
                            <ol className="race-results-list">
                              {(race.resultsOrder || []).map(
                                (driver, index) => (
                                  <li
                                    key={driver}
                                    className={`race-result-row ${teamClass(
                                      driver
                                    )}`}
                                  >
                                    <span
                                      className={`race-result-stripe ${teamClass(
                                        driver
                                      )}`}
                                      aria-hidden="true"
                                    />
                                    <div className="race-result-main">
                                      <span
                                        className={`race-result-badge ${teamClass(
                                          driver
                                        )}`}
                                      >
                                        #{index + 1}
                                      </span>
                                      <div className="race-result-text">
                                        <span className="race-result-name">
                                          {driver}
                                        </span>
                                        <span className="race-result-team">
                                          {teamLabel(driver)}
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                )
                              )}
                            </ol>
                          ) : (
                            race.results || "Keine Ergebnisse eingetragen"
                          )}
                        </div>
                      </div>

                      <div className="race-detail-block">
                        <p className="race-detail-title">Teilnehmende Fahrer</p>
                        <div className="race-detail-content">
                          {driverList.length === 0 ? (
                            "Keine Fahrer zugeordnet"
                          ) : (
                            <div className="race-driver-chip-grid">
                              {driverList.map((driver) => (
                                <span
                                  key={driver}
                                  className={`race-driver-chip ${teamClass(
                                    driver
                                  )}`}
                                >
                                  {driver}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminRaceListPage;
