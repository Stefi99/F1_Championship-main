import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrackVisual } from "../../data/tracks";
import { loadPlayerTips } from "../../utils/tips";

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

  const votingRaces = useMemo(
    () => sortedRaces.filter((race) => race.status === "voting"),
    [sortedRaces]
  );

  const closedRaces = useMemo(
    () => sortedRaces.filter((race) => race.status === "closed"),
    [sortedRaces]
  );

  const savedTipsCount = useMemo(
    () => Object.keys(tips || {}).length,
    [tips]
  );

  const formatDate = (value) => {
    const date = parseDate(value);
    if (!date) return "Datum folgt";
    return date.toLocaleDateString("de-DE");
  };

  const renderRaceCard = (race) => {
    const visual = getTrackVisual(race.track);
    const tip = tips[race.id];
    const updatedAt = tip?.updatedAt
      ? new Date(tip.updatedAt).toLocaleString("de-DE")
      : null;
    const canTip = race.status === "voting";

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
              className={`player-status-chip status-${
                race.status || "open"
              }`}
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
            {tip?.order?.length ? (
              <div className="player-tip-chip">
                <span className="player-tip-chip-rank">#1</span>
                <span className="player-tip-chip-name">
                  {tip.order[0] || "Top-Pick"}
                </span>
              </div>
            ) : (
              <div className="player-tip-chip muted">Top-Pick fehlt</div>
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
            klickbar und fuehren direkt zur Tipp-Seite.
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
              Zurueck zum Dashboard
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
            <p className="player-eyebrow muted">Uebersicht</p>
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
