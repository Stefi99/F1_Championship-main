/**
 * PlayerRaceListPage - Zeigt alle Rennen aus Spielersicht
 *
 * Diese Seite zeigt:
 * - Alle Rennen in chronologischer Reihenfolge
 * - Offene Tippfenster (Status = "voting")
 * - Gespeicherte Tipps pro Rennen
 * - Vergleich zwischen Tipp und offiziellem Ergebnis (wenn verfügbar)
 *
 * Jede Rennkarte ist klickbar und führt zur Tipp-Seite.
 */
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";
import { getTrackVisual } from "../../data/tracks";
import { loadPlayerTips } from "../../utils/tips";
import { getAllRaces } from "../../services/raceService.js";

/**
 * Übersetzungs-Tabellen für UI-Anzeige von Renn- und Wetterstatus
 */
const statusLabel = {
  open: "Geplant",
  voting: "Voting",
  closed: "Geschlossen",
};

const weatherLabel = {
  sunny: "Sonne",
  cloudy: "Wolken",
  rain: "Regen",
};

/**
 * parseDate - Konvertiert einen Datumswert in ein Date-Objekt
 *
 * Wird für Sortierung verwendet, um Daten korrekt zu vergleichen.
 *
 * @param {string|Date} value - Datumswert
 * @returns {Date|null} Date-Objekt oder null wenn ungültig
 */
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

function PlayerRaceListPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * State für Rennen und gespeicherte Tipps
   */
  const [races, setRaces] = useState([]);
  const [tips, setTips] = useState({});

  /**
   * Effect: Lädt Rennen und gespeicherte Tipps vom Backend
   *
   * Tipps werden nur geladen, wenn ein User eingeloggt ist.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const racesData = await getAllRaces();
        setRaces(racesData);

        // Tipps nur laden, wenn User eingeloggt ist
        if (user?.id) {
          const tipsData = await loadPlayerTips(user.id);
          setTips(tipsData);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        setRaces([]);
        setTips({});
      }
    };

    fetchData();
  }, [user]);

  /**
   * sortedRaces - Sortiert die Rennen nach Datum (aufsteigend)
   *
   * Die nächste Strecke steht oben. Rennen ohne Datum werden ans Ende sortiert.
   * Wird mit useMemo optimiert.
   */
  const sortedRaces = useMemo(() => {
    return [...races].sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      if (!da && !db) return 0;
      if (!da) return 1; // Rennen ohne Datum nach hinten
      if (!db) return -1;
      return da - db; // Aufsteigend sortieren
    });
  }, [races]);

  /**
   * Gefilterte Rennen-Listen nach Status
   *
   * Wird mit useMemo optimiert, um Neuberechnungen nur bei Änderungen
   * der sortierten Rennen-Liste durchzuführen.
   */
  const votingRaces = useMemo(
    () => sortedRaces.filter((race) => race.status === "voting"),
    [sortedRaces]
  );

  const closedRaces = useMemo(
    () => sortedRaces.filter((race) => race.status === "closed"),
    [sortedRaces]
  );

  /**
   * savedTipsCount - Anzahl der gespeicherten Tipps
   *
   * Wird zur Anzeige im Dashboard verwendet.
   */
  const savedTipsCount = useMemo(() => Object.keys(tips || {}).length, [tips]);

  /**
   * formatDate - Formatiert Datumswerte für die UI
   *
   * @param {string|Date} value - Datumswert
   * @returns {string} Formatiertes Datum oder Fallback-Text
   */
  const formatDate = (value) => {
    const date = parseDate(value);
    if (!date) return "Datum folgt";
    return date.toLocaleDateString("de-DE");
  };

  /**
   * renderRaceCard - Rendert eine einzelne Rennkarte
   *
   * Zeigt:
   * - Strecken-Informationen mit visueller Darstellung
   * - Status und Wetter
   * - Gespeicherten Tipp (falls vorhanden)
   * - Vergleich zwischen Tipp und Ergebnis (wenn Rennen geschlossen)
   *
   * Die Karte ist klickbar und führt zur Tipp-Seite.
   *
   * @param {Object} race - Rennen-Objekt
   * @returns {JSX.Element} Rennkarte-Komponente
   */
  const renderRaceCard = (race) => {
    const visual = getTrackVisual(race.track);
    const tip = tips[race.id];
    const tipOrder = Array.isArray(tip?.order)
      ? tip.order
      : Array.isArray(tip)
      ? tip
      : [];
    const resultsOrder = Array.isArray(race.resultsOrder)
      ? race.resultsOrder
      : [];
    const updatedAt = tip?.updatedAt
      ? new Date(tip.updatedAt).toLocaleString("de-DE")
      : null;
    const canTip = race.status === "voting";
    const showResults =
      race.status === "closed" &&
      resultsOrder.length > 0 &&
      tipOrder.length > 0;

    // Darstellung der kompletten Rennübersicht
    return (
      <article
        key={race.id}
        className="player-race-card"
        onClick={() => navigate(`/player/race/${race.id}/tips`)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            navigate(`/player/race/${race.id}/tips`);
          }
        }}
      >
        <div
          className="player-race-media"
          style={{
            backgroundImage: `${visual.pattern}, ${visual.gradient}`,
          }}
        >
          <div className="player-race-media-top">
            <span className="player-pill">{visual.code || "F1"}</span>
            <span
              className={`player-status-chip status-${race.status || "open"}`}
            >
              {statusLabel[race.status] || statusLabel.open}
            </span>
          </div>
          <div className="player-race-media-body">
            <p className="player-eyebrow">{visual.label || race.track}</p>
            <h3>{race.track || "Rennen folgt"}</h3>
            <p className="player-race-meta-line">
              {formatDate(race.date)}{" "}
              <span className="player-dot">{"\u00b7"}</span>{" "}
              {weatherLabel[race.weather] || "Wetter folgt"}
            </p>
          </div>
        </div>

        <div className="player-race-card-body">
          <div className="player-race-card-copy">
            <p className="player-sub">
              {tip
                ? `Tipp gespeichert${updatedAt ? ` am ${updatedAt}` : ""}.`
                : "Noch keinen Tipp abgegeben."}
            </p>
            {tipOrder?.length ? (
              <div className="player-tip-chip">
                <span className="player-tip-chip-rank">#1</span>
                <span className="player-tip-chip-name">
                  {tipOrder[0] || "Top-Pick"}
                </span>
              </div>
            ) : (
              <div className="player-tip-chip muted">Top-Pick fehlt</div>
            )}
            {showResults && (
              <div className="player-tip-results" aria-label="Tipp vs Ergebnis">
                <span className="player-tip-result-label">Ergebnis</span>
                {tipOrder
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((driver, index) => {
                    const officialIndex = resultsOrder.indexOf(driver);
                    const officialPos =
                      officialIndex >= 0 ? officialIndex + 1 : null;
                    return (
                      <span
                        key={`${race.id}-${driver}`}
                        className={`player-tip-result-pill ${
                          officialPos ? "" : "is-missing"
                        }`}
                      >
                        <span className="player-tip-result-pred">
                          #{index + 1}
                        </span>
                        <span className="player-tip-result-name">{driver}</span>
                        <span className="player-tip-result-official">
                          {officialPos ? `P${officialPos}` : "kein Ergebnis"}
                        </span>
                      </span>
                    );
                  })}
              </div>
            )}
          </div>
          <div className="player-race-card-actions">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/player/race/${race.id}/tips`);
              }}
            >
              {canTip ? "Jetzt tippen" : "Tipp ansehen"}
            </button>
            <button
              type="button"
              className="player-ghost-btn"
              onClick={(event) => {
                event.stopPropagation();
                navigate("/player/leaderboard");
              }}
            >
              Rangliste
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="player-races-page">
      <header className="player-races-hero">
        <div>
          <p className="player-eyebrow">Tipps</p>
          <h1>Rennen zum Tippen</h1>
          <p className="player-sub">
            Alle Events im selben Look wie Dashboard und Home. Strecken sind
            klickbar und führen direkt zur Tipp-Seite.
          </p>
          <div className="player-badge-row">
            <span className="player-badge">Gesamt: {sortedRaces.length}</span>
            <span className="player-badge accent">
              Voting: {votingRaces.length}
            </span>
            <span className="player-badge muted">
              Gespeicherte Tipps: {savedTipsCount}
            </span>
          </div>
        </div>
        <div className="player-races-stats">
          <div className="player-races-stat">
            <strong>{votingRaces.length}</strong>
            <span>Voting offen</span>
          </div>
          <div className="player-races-stat">
            <strong>{races.length - closedRaces.length}</strong>
            <span>In Planung</span>
          </div>
          <div className="player-races-stat">
            <strong>{closedRaces.length}</strong>
            <span>Abgeschlossen</span>
          </div>
        </div>
      </header>

      <section className="player-race-section">
        <div className="player-race-section-head">
          <div>
            <p className="player-eyebrow muted">Aktiv</p>
            <h2>Offene Tippfenster</h2>
            <p className="player-sub">
              Direkt zur Strecke springen und die Top 10 platzieren.
            </p>
          </div>
        </div>

        {votingRaces.length === 0 ? (
          <div className="player-empty">
            <p>Aktuell ist kein Tippfenster offen.</p>
            <button type="button" onClick={() => navigate("/player")}>
              Zurück zum Dashboard
            </button>
          </div>
        ) : (
          <div className="player-race-grid">
            {votingRaces.map((race) => renderRaceCard(race))}
          </div>
        )}
      </section>

      <section className="player-race-section">
        <div className="player-race-section-head">
          <div>
            <p className="player-eyebrow muted">Übersicht</p>
            <h2>Alle Rennen</h2>
            <p className="player-sub">
              Plane deine Tipps, egal ob geplant, offen oder schon beendet.
            </p>
          </div>
        </div>

        {sortedRaces.length === 0 ? (
          <div className="player-empty">
            <p>Noch keine Rennen angelegt.</p>
            <button type="button" onClick={() => navigate("/player")}>
              Zum Dashboard
            </button>
          </div>
        ) : (
          <div className="player-race-grid">
            {sortedRaces.map((race) => renderRaceCard(race))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PlayerRaceListPage;
