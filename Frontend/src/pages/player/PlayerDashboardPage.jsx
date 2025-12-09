// Zentrales Dashboard für Spieler. Zeigt Profildaten, offene Tippfenster,
// kommende Rennen und Schnellzugriffe (Tippen, Leaderboard, Profil).
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";
import { getTrackVisual } from "../../data/tracks";
import { loadPlayerProfile } from "../../utils/profile";

// Mapping-Tabellen für die UI-Anzeige der Renn- und Wetterstatus-Werte.
const statusLabel = {
  open: "Geplant",
  voting: "Tippen offen",
  closed: "Abgeschlossen",
};

const weatherLabel = {
  sunny: "Sonne",
  cloudy: "Wolken",
  rain: "Regen",
};

function PlayerDashboardPage() {
  // Zugriff auf aktuellen Benutzer aus dem globalen Auth-Kontext.
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => loadPlayerProfile());
  const [races, setRaces] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(loadPlayerProfile());
  }, [user]);

  useEffect(() => {
    const readRaces = () => {
      try {
        return JSON.parse(localStorage.getItem("races") || "[]");
      } catch (err) {
        console.error("races parse error", err);
        return [];
      }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRaces(readRaces());

    const handleStorage = (event) => {
      if (
        event.key === "races" ||
        event.key === "playerProfile" ||
        event.key === null
      ) {
        setRaces(readRaces());
        setProfile(loadPlayerProfile());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Berechnet Statistiken über alle Rennen
  const stats = useMemo(() => {
    const open = races.filter((race) => race.status === "open").length;
    const voting = races.filter((race) => race.status === "voting").length;
    const closed = races.filter((race) => race.status === "closed").length;
    return {
      total: races.length,
      open,
      voting,
      closed,
    };
  }, [races]);

  // Filtert die Rennen nach Status, um nur relevante Listen anzuzeigen.
  const votingRaces = useMemo(
    () => races.filter((race) => race.status === "voting"),
    [races]
  );
  const openRaces = useMemo(
    () => races.filter((race) => race.status === "open"),
    [races]
  );

  // Ermittelt das nächste anstehende Rennen
  const nextRace = useMemo(() => {
    const toTimestamp = (value) => {
      if (!value) return Number.POSITIVE_INFINITY;
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
    };
    return (
      [...races]
        .filter((race) => race.status !== "closed")
        .sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date))[0] || null
    );
  }, [races]);

  // Hilfsfunktionen zur formatierten Ausgabe von Datums- und Zeitwerten
  const formatDate = (value) => {
    if (!value) return "Datum folgt";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("de-DE");
  };

  const formatDateTime = (value, fallback = "Noch nie angepasst") => {
    if (!value) return fallback;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleString("de-DE");
  };

  // Definiert die Shortcut-Karten für das Dashboard
  const actions = [
    {
      title: "Tipps abgeben",
      description: "Offene Tippfenster ansehen und direkt tippen.",
      cta: votingRaces.length > 0 ? "Zu den Tipps" : "Zu den Rennen",
      onClick: () =>
        votingRaces.length > 0
          ? navigate(`/player/race/${votingRaces[0].id}/tips`)
          : navigate("/player/races"),
    },
    {
      title: "Rangliste",
      description: "Aktuelle Punkte und Platzierungen checken.",
      cta: "Rangliste ansehen",
      onClick: () => navigate("/player/leaderboard"),
    },
    {
      title: "Profil",
      description: "Namen, Passwort oder Team anpassen.",
      cta: "Profil bearbeiten",
      onClick: () => navigate("/player/profile"),
    },
  ];

  const nextRaceVisual = nextRace ? getTrackVisual(nextRace.track) : null;
  const displayName = profile.displayName || user?.username || "Player";
  const favoriteLabel =
    profile.favoriteTeam && profile.favoriteTeam !== "Keines"
      ? profile.favoriteTeam
      : "Kein Favorit";
  const playerPoints = Number.isNaN(Number(profile.points))
    ? 0
    : Number(profile.points);

  // Darstellung des Spieler-Dashboards
  return (
    <div className="player-dashboard">
      <header className="player-hero">
        <div className="player-hero-copy">
          <p className="player-eyebrow">Willkommen, {displayName}</p>
          <h1>Dein Fahrer-Hub</h1>
          <p className="player-sub">
            Übersicht über offene Tipps, kommende Rennen und deine Profildaten
            im gleichen Look wie Admin- und Home-Dashboard.
          </p>
          <div className="player-hero-actions">
            <button type="button" onClick={() => navigate("/player/races")}>
              Rennen überblicken
            </button>
            <button
              type="button"
              className="player-ghost-btn"
              onClick={() => navigate("/player/profile")}
            >
              Profil bearbeiten
            </button>
          </div>
          <div className="player-badge-row">
            <span className="player-badge">User: {profile.username}</span>
            {profile.email && (
              <span className="player-badge muted">{profile.email}</span>
            )}
            {profile.favoriteTeam && (
              <span className="player-badge accent">
                Lieblingsteam: {favoriteLabel}
              </span>
            )}
          </div>
        </div>
        <div className="player-hero-stats">
          <div className="player-stat">
            <span>Meine Punkte</span>
            <strong>{playerPoints}</strong>
          </div>
          <div className="player-stat">
            <span>Tippen offen</span>
            <strong>{stats.voting}</strong>
          </div>
          <div className="player-stat">
            <span>Geplant</span>
            <strong>{stats.open}</strong>
          </div>
          <div className="player-stat">
            <span>Abgeschlossen</span>
            <strong>{stats.closed}</strong>
          </div>
        </div>
      </header>

      <section className="player-actions-grid">
        {actions.map((action) => (
          <article key={action.title} className="player-action-card">
            <div>
              <p className="player-eyebrow muted">Shortcut</p>
              <h3>{action.title}</h3>
              <p className="player-sub">{action.description}</p>
            </div>
            <button
              type="button"
              className="player-ghost-btn"
              onClick={action.onClick}
            >
              {action.cta}
            </button>
          </article>
        ))}
      </section>

      <section className="player-grid">
        <article className="player-highlight-card">
          <div className="player-card-head">
            <div>
              <p className="player-eyebrow">Nächstes Event</p>
              <h2>{nextRace ? nextRace.track : "Noch kein Rennen geplant"}</h2>
              <p className="player-sub">
                {nextRace
                  ? "Infos zu Datum, Wetter und Status, damit du planen kannst."
                  : "Sobald der Admin Rennen anlegt, erscheinen sie hier."}
              </p>
            </div>
            {nextRace && (
              <span
                className={`player-status-chip status-${
                  nextRace.status || "open"
                }`}
              >
                {statusLabel[nextRace.status] || "Geplant"}
              </span>
            )}
          </div>
          {nextRace ? (
            <div className="player-highlight-body">
              <div className="player-highlight-media">
                <div
                  className="player-track-visual"
                  style={{
                    backgroundImage: `${nextRaceVisual?.pattern || ""}${
                      nextRaceVisual ? ", " : ""
                    }${nextRaceVisual?.gradient || "#0f1118"}`,
                  }}
                />
              </div>
              <div className="player-highlight-meta">
                <div className="player-meta-tile">
                  <span>Datum</span>
                  <strong>{formatDate(nextRace.date)}</strong>
                </div>
                <div className="player-meta-tile">
                  <span>Wetter</span>
                  <strong>{weatherLabel[nextRace.weather] || "TBA"}</strong>
                </div>
                <div className="player-meta-tile">
                  <span>Status</span>
                  <strong>
                    {statusLabel[nextRace.status] || statusLabel.open}
                  </strong>
                </div>
              </div>
              <div className="player-highlight-actions">
                <button type="button" onClick={() => navigate("/player/races")}>
                  Rennübersicht
                </button>
                <button
                  type="button"
                  className="player-ghost-btn"
                  onClick={() =>
                    nextRace.status === "voting"
                      ? navigate(`/player/race/${nextRace.id}/tips`)
                      : navigate("/player/leaderboard")
                  }
                >
                  {nextRace.status === "voting" ? "Jetzt tippen" : "Rangliste"}
                </button>
              </div>
            </div>
          ) : (
            <div className="player-empty">
              <p>Noch keine Rennen angelegt.</p>
              <button type="button" onClick={() => navigate("/player/races")}>
                Zu den Rennen
              </button>
            </div>
          )}
        </article>

        <article className="player-card">
          <div className="player-card-head">
            <div>
              <p className="player-eyebrow">Aktive Tippfenster</p>
              <h3>Direkt loslegen</h3>
            </div>
            <button
              type="button"
              className="player-ghost-btn"
              onClick={() => navigate("/player/races")}
            >
              Alle Rennen
            </button>
          </div>
          {votingRaces.length === 0 ? (
            <div className="player-empty">
              <p>Aktuell ist kein Tippfenster offen.</p>
            </div>
          ) : (
            <div className="player-race-list">
              {votingRaces.map((race) => (
                <div key={race.id} className="player-race-row">
                  <div className="player-race-row-main">
                    <span className="player-pill">{race.track}</span>
                    <div className="player-race-meta">
                      <span>{formatDate(race.date)}</span>
                      <span className="player-dot">·</span>
                      <span>
                        {weatherLabel[race.weather] || "Wetter folgt"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="player-ghost-btn"
                    onClick={() => navigate(`/player/race/${race.id}/tips`)}
                  >
                    Tippen
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="player-card">
          <div className="player-card-head">
            <div>
              <p className="player-eyebrow">Profil</p>
              <h3>Snapshot</h3>
              <p className="player-sub">
                Kontrolliere deine Daten oder passe sie mit einem Klick an.
              </p>
            </div>
            <button
              type="button"
              className="player-ghost-btn"
              onClick={() => navigate("/player/profile")}
            >
              Profil öffnen
            </button>
          </div>
          <div className="player-profile-summary">
            <div className="player-summary-item">
              <span>Name</span>
              <strong>{profile.displayName || "Unbekannt"}</strong>
            </div>
            <div className="player-summary-item">
              <span>E-Mail</span>
              <strong>{profile.email || "Keine Mail hinterlegt"}</strong>
            </div>
            <div className="player-summary-item">
              <span>Punkte</span>
              <strong>{playerPoints}</strong>
            </div>
            <div className="player-summary-item">
              <span>Lieblingsteam</span>
              <strong>{favoriteLabel} </strong>
            </div>
            <div className="player-summary-item">
              <span>Letztes Update</span>
              <strong>{formatDateTime(profile.lastUpdated)}</strong>
            </div>
            <div className="player-summary-item">
              <span>Passwort</span>
              <strong>
                {profile.lastPasswordChange
                  ? `Geändert am ${formatDateTime(profile.lastPasswordChange)}`
                  : "Noch nicht gesetzt"}
              </strong>
            </div>
          </div>
        </article>

        <article className="player-card">
          <div className="player-card-head">
            <div>
              <p className="player-eyebrow">Saisonstatus</p>
              <h3>Planung und Abschluss</h3>
            </div>
          </div>
          <div className="player-grid-stats">
            <div className="player-stat-tile">
              <span>Geplante Rennen</span>
              <strong>{openRaces.length}</strong>
            </div>
            <div className="player-stat-tile">
              <span>Tippen aktiv</span>
              <strong>{votingRaces.length}</strong>
            </div>
            <div className="player-stat-tile">
              <span>Abgeschlossen</span>
              <strong>{stats.closed}</strong>
            </div>
            <div className="player-stat-tile">
              <span>Gesamt</span>
              <strong>{stats.total}</strong>
            </div>
          </div>
          <p className="player-sub">
            Rennstatus kommt direkt aus der Admin-Verwaltung. Offene und aktive
            Events tauchen automatisch auf.
          </p>
        </article>
      </section>
    </div>
  );
}

export default PlayerDashboardPage;
