// Zeigt alle Rennen aus Spielersicht in chronologischer Reihenfolge
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrackVisual } from "../../data/tracks";
import { loadPlayerTips } from "../../utils/tips";

// Übersetzungs-Tabellen für UI-Anzeige von Renn- und Wetterstatus
const statusLabel = {
  open: "Geplant",
  voting: "Tippen offen",
  closed: "Geschlossen",
};

const weatherLabel = {
  sunny: "Sonne",
  cloudy: "Wolken",
  rain: "Regen",
};

// Hilfsfunktion, um Daten für Sortierung in echte Date-Objekte umzuwandeln
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

function PlayerRaceListPage() {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [tips, setTips] = useState({});

  // Lädt Rennen und gespeicherte Tipps. Listener sorgt dafür,
  // dass Änderungen aus anderen Tabs übernommen werden.
  useEffect(() => {
    const readRaces = () => {
      try {
        return JSON.parse(localStorage.getItem("races") || "[]");
      } catch (err) {
        console.error("races parse error", err);
        return [];
      }
    };

    const readTips = () => loadPlayerTips();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRaces(readRaces());
    setTips(readTips());

    const handleStorage = (event) => {
      if (
        event.key === "races" ||
        event.key === "playerTips" ||
        event.key === null
      ) {
        setRaces(readRaces());
        setTips(readTips());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Sortiert die Rennen nach Datum (aufsteigend), sodass die nächste Strecke oben steht
  const sortedRaces = useMemo(() => {
    return [...races].sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });
  }, [races]);

  // Filtert Rennen nach Status für separate Bereiche
  const votingRaces = useMemo(
    () => sortedRaces.filter((race) => race.status === "voting"),
    [sortedRaces]
  );

  const closedRaces = useMemo(
    () => sortedRaces.filter((race) => race.status === "closed"),
    [sortedRaces]
  );

  // Anzahl der gespeicherten Tipps zur Anzeige im Dashboard
  const savedTipsCount = useMemo(() => Object.keys(tips || {}).length, [tips]);

  // Formatiert Datumswerte für die UI
  const formatDate = (value) => {
    const date = parseDate(value);
    if (!date) return "Datum folgt";
    return date.toLocaleDateString("de-DE");
  };

  // Rendert eine einzelne Rennkarte
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
              Tippen offen: {votingRaces.length}
            </span>
            <span className="player-badge muted">
              Gespeicherte Tipps: {savedTipsCount}
            </span>
          </div>
        </div>
        <div className="player-races-stats">
          <div className="player-races-stat">
            <strong>{votingRaces.length}</strong>
            <span>Tippfenster offen</span>
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
