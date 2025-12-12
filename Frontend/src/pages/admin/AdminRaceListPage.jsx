/**
 * AdminRaceListPage - Seite für die Verwaltung aller Rennen (Admin-Bereich)
 *
 * Zeigt eine Übersicht aller Rennen mit:
 * - Statistiken (Gesamt, offen/voting, geschlossen)
 * - Karten für jedes Rennen mit visueller Streckendarstellung
 * - Erweiterbare Detailansicht mit Ergebnissen und teilnehmenden Fahrern
 * - Schnellzugriffe zum Bearbeiten, Löschen und zu Ergebnissen
 *
 * Jede Rennkarte zeigt Strecke, Datum, Wetter, Reifen, Status und
 * kann erweitert werden, um Details anzuzeigen.
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriverTeam, TEAM_CLASS_MAP } from "../../data/drivers";
import { getTrackVisual } from "../../data/tracks";
import { getAllRaces, deleteRace } from "../../services/raceService.js";
import { ApiError } from "../../utils/api.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

function AdminRaceListPage() {
  const navigate = useNavigate();
  // Liste aller Rennen (vom Backend geladen)
  const [races, setRaces] = useState([]);
  // ID des Rennens, dessen Detailansicht erweitert ist (null wenn keine)
  const [expandedId, setExpandedId] = useState(null);
  // Loading-State für initiales Laden der Rennen
  const [loading, setLoading] = useState(true);
  // Fehler-Objekt (falls beim Laden ein Fehler auftritt)
  const [error, setError] = useState(null);

  /**
   * Hilfsfunktionen für Team-Informationen in der Detailansicht
   */

  /**
   * teamClass - Gibt die CSS-Klasse für das Team eines Fahrers zurück
   *
   * @param {string} driverName - Name des Fahrers
   * @returns {string} CSS-Klasse für das Team
   */
  const teamClass = (driverName) => {
    const team = getDriverTeam(driverName);
    return TEAM_CLASS_MAP[team] || "team-default";
  };

  /**
   * teamLabel - Gibt den Team-Namen eines Fahrers zurück
   *
   * @param {string} driverName - Name des Fahrers
   * @returns {string} Team-Name oder "Team unbekannt"
   */
  const teamLabel = (driverName) =>
    getDriverTeam(driverName) || "Team unbekannt";

  /**
   * Mapping-Tabellen für die Übersetzung technischer Werte in benutzerfreundliche Labels
   */

  /**
   * statusLabel - Übersetzt Status-Werte in deutsche Labels
   */
  const statusLabel = {
    open: "Offen",
    voting: "Voting",
    closed: "Geschlossen",
  };

  /**
   * weatherLabel - Übersetzt Wetter-Werte in deutsche Labels
   */
  const weatherLabel = {
    sunny: "Sonne",
    cloudy: "Wolkig",
    rain: "Regen",
  };

  /**
   * tyreLabel - Übersetzt Reifen-Werte in Labels
   */
  const tyreLabel = {
    soft: "Soft",
    medium: "Medium",
    hard: "Hard",
  };

  /**
   * Effect: Lädt alle Rennen vom Backend beim ersten Rendern
   */
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

  /**
   * stats - Berechnet Statistiken über die Rennen
   *
   * Wird mit useMemo optimiert, um Neuberechnungen nur bei Änderungen
   * der Rennen-Liste durchzuführen.
   *
   * Berechnet:
   * - total: Gesamtanzahl aller Rennen
   * - openCount: Anzahl offener Rennen
   * - votingCount: Anzahl Rennen im Voting-Status
   * - closedCount: Anzahl geschlossener Rennen
   */
  const stats = useMemo(() => {
    const total = races.length;
    const openCount = races.filter((race) => race.status === "open").length;
    const votingCount = races.filter((race) => race.status === "voting").length;
    const closedCount = races.filter((race) => race.status === "closed").length;

    console.log(
      "Race statuses: ",
      races.map((r) => r.status)
    );
    return { total, openCount, votingCount, closedCount };
  }, [races]);

  /**
   * handleDelete - Löscht ein Rennen nach Bestätigung durch den Benutzer
   *
   * Zeigt eine Bestätigungsabfrage an, bevor das Rennen gelöscht wird.
   * Nach erfolgreichem Löschen wird das Rennen aus der lokalen Liste entfernt.
   *
   * @param {string|number} id - ID des zu löschenden Rennens
   */
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

  /**
   * toggleExpand - Öffnet oder schließt die Detailansicht einer Rennkarte
   *
   * Wenn die Karte bereits erweitert ist, wird sie geschlossen.
   * Wenn sie geschlossen ist, wird sie erweitert.
   *
   * @param {string|number} id - ID des Rennens
   */
  const toggleExpand = (id) =>
    setExpandedId((prev) => (String(prev) === String(id) ? null : id));

  /**
   * mediaStyle - Erzeugt die Hintergrund-Styles für die Track-Karte
   *
   * Kombiniert mehrere Hintergrund-Layer (Pattern, Bild, Gradient)
   * zu einem CSS-Style-Objekt für die visuelle Darstellung der Strecke.
   *
   * @param {Object} visual - Track-Visual-Objekt mit pattern, image, gradient
   * @returns {Object} CSS-Style-Objekt für backgroundImage
   */
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
