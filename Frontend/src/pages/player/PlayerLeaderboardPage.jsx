import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEAM_CLASS_MAP } from "../../data/drivers";
import { getTrackVisual } from "../../data/tracks";
import { loadPlayerProfile } from "../../utils/profile";
import { loadPlayerTips } from "../../utils/tips";

const TEAM_COLOR_PALETTE = {
  "team-red-bull": "#2037c4",
  "team-ferrari": "#dc0000",
  "team-mercedes": "#00d2be",
  "team-mclaren": "#ff8700",
  "team-aston-martin": "#00594f",
  "team-alpine": "#2b9be8",
  "team-sauber": "#52e252",
  "team-haas": "#b6babd",
  "team-williams": "#1c7ef2",
  "team-rb": "#0f1f7a",
  "team-default": "#e10600",
};

const SEED_PLAYERS = [
  { username: "gridfox", displayName: "Grid Fox", team: "Ferrari", country: "ITA", base: 240 },
  { username: "polehunter", displayName: "Pole Hunter", team: "Red Bull", country: "AUT", base: 228 },
  { username: "undercut", displayName: "Undercut Pro", team: "Mercedes", country: "GER", base: 214 },
  { username: "drywet", displayName: "Rain Whisperer", team: "McLaren", country: "GBR", base: 205 },
  { username: "latebraker", displayName: "Late Braker", team: "Aston Martin", country: "ESP", base: 192 },
];

const loadPlayerRoster = () => {
  try {
    const raw = JSON.parse(localStorage.getItem("playerRoster") || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .map((entry) => ({
        username: entry.username || entry.displayName || "user",
        displayName: entry.displayName || entry.username || "Player",
        team: entry.team || entry.favoriteTeam || "Eigenes Team",
        country: entry.country || "CH",
        points: Number.isNaN(Number(entry.points)) ? 0 : Number(entry.points),
        form: Number.isNaN(Number(entry.form)) ? 0 : Number(entry.form),
        lastRacePoints: Number.isNaN(Number(entry.lastRacePoints))
          ? 0
          : Number(entry.lastRacePoints),
        isUser: false,
      }))
      .filter((entry) => entry.username);
  } catch (err) {
    console.error("playerRoster parse error", err);
    return [];
  }
};

const POSITION_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 3, 2];

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) return "Datum folgt";
  return date.toLocaleDateString("de-DE");
};

const teamClass = (teamName) => TEAM_CLASS_MAP[teamName] || "team-default";

const scoreTipAgainstResults = (tipOrder = [], resultsOrder = []) => {
  const trimmedTip = Array.isArray(tipOrder) ? tipOrder.slice(0, 10) : [];
  const official = Array.isArray(resultsOrder) ? resultsOrder.slice(0, 10) : [];

  let score = 0;
  let exact = 0;
  let near = 0;
  let inTop = 0;
  let bestPick = null;

  trimmedTip.forEach((driver, index) => {
    const officialIndex = official.indexOf(driver);
    if (officialIndex === -1) return;

    const detail = {
      driver,
      predicted: index + 1,
      official: officialIndex + 1,
      points: 0,
    };

    if (officialIndex === index) {
      exact += 1;
      detail.points = (POSITION_POINTS[index] || 2) + (index === 0 ? 5 : 0);
    } else if (Math.abs(officialIndex - index) === 1) {
      near += 1;
      detail.points = Math.max(6, Math.round((POSITION_POINTS[index] || 4) * 0.5));
    } else {
      inTop += 1;
      detail.points = 3;
    }

    score += detail.points;
    if (!bestPick || detail.points > bestPick.points) {
      bestPick = detail;
    }
  });

  if (trimmedTip[0] && trimmedTip[0] === official[0]) {
    score += 5;
  }

  const podiumHits = trimmedTip
    .slice(0, 3)
    .filter((name) => official.slice(0, 3).includes(name)).length;
  if (podiumHits === 3) {
    score += 6;
  }

  const accuracyBase = Math.min(official.length, trimmedTip.length) || 1;
  const accuracy = Math.round((exact / accuracyBase) * 100);

  return {
    score,
    exact,
    near,
    inTop,
    accuracy,
    bestPick,
  };
};

const deterministicRaceScore = (race, seedIndex) => {
  const code = String(race.id || race.track || seedIndex)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 14 + ((code + seedIndex * 17) % 18);
};

const buildSeedOpponents = (closedRaces) =>
  SEED_PLAYERS.map((player, idx) => {
    const perRace = closedRaces.map((race) => deterministicRaceScore(race, idx));
    const raceTotal = perRace.reduce((sum, value) => sum + value, 0);
    return {
      ...player,
      points: player.base + raceTotal,
      form: Math.round(perRace.slice(-3).reduce((sum, value) => sum + value, 0) / Math.max(1, Math.min(perRace.length, 3))),
      lastRacePoints: perRace.slice(-1)[0] || player.base / 10,
      isUser: false,
    };
  });

function PlayerLeaderboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => loadPlayerProfile());
  const [races, setRaces] = useState([]);
  const [tips, setTips] = useState(() => loadPlayerTips());
  const [roster, setRoster] = useState(() => loadPlayerRoster());

  useEffect(() => {
    const readRaces = () => {
      try {
        return JSON.parse(localStorage.getItem("races") || "[]");
      } catch (err) {
        console.error("races parse error", err);
        return [];
      }
    };

    setRaces(readRaces());
    setTips(loadPlayerTips());
    setProfile(loadPlayerProfile());
    setRoster(loadPlayerRoster());

    const handleStorage = (event) => {
      if (
        event.key === "races" ||
        event.key === "playerTips" ||
        event.key === "playerProfile" ||
        event.key === "playerRoster" ||
        event.key === null
      ) {
        setRaces(readRaces());
        setTips(loadPlayerTips());
        setProfile(loadPlayerProfile());
        setRoster(loadPlayerRoster());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const closedRaces = useMemo(
    () =>
      races.filter(
        (race) =>
          race.status === "closed" &&
          Array.isArray(race.resultsOrder) &&
          race.resultsOrder.length > 0
      ),
    [races]
  );

  const raceStats = useMemo(() => {
    return closedRaces.map((race) => {
      const entry = tips?.[race.id] || {};
      const order = entry.order || entry;
      const scoring = scoreTipAgainstResults(order || [], race.resultsOrder || []);
      return {
        ...race,
        ...scoring,
        visual: getTrackVisual(race.track),
        tip: Array.isArray(order) ? order.slice(0, 10) : [],
        winner: race.resultsOrder?.[0],
      };
    });
  }, [closedRaces, tips]);

  const sortedRaceStats = useMemo(() => {
    return [...raceStats].sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db - da;
    });
  }, [raceStats]);

  const seasonPoints = useMemo(() => {
    const base = Number.isNaN(Number(profile.points)) ? 0 : Number(profile.points);
    const fromTips = raceStats.reduce((sum, race) => sum + race.score, 0);
    return base + fromTips;
  }, [profile.points, raceStats]);

  const accuracyAverage = raceStats.length
    ? Math.round(
        raceStats.reduce((sum, race) => sum + race.accuracy, 0) /
          raceStats.length
      )
    : 0;

  const formPoints = useMemo(() => {
    const lastThree = sortedRaceStats.slice(0, 3);
    if (lastThree.length === 0) return 0;
    const total = lastThree.reduce((sum, race) => sum + race.score, 0);
    return Math.round(total / lastThree.length);
  }, [sortedRaceStats]);

  const bestRace = sortedRaceStats.reduce((best, race) => {
    if (!best) return race;
    return race.score > best.score ? race : best;
  }, null);

  const latestRace = sortedRaceStats[0] || null;

  const leaderboardRows = useMemo(() => {
    const baseRoster = roster.length > 0 ? roster : buildSeedOpponents(closedRaces);
    const userEntry = {
      username: profile.username || "du",
      displayName: profile.displayName || profile.username || "Du",
      team: profile.favoriteTeam || "Eigenes Team",
      country: profile.country || "CH",
      points: seasonPoints,
      form: formPoints,
      lastRacePoints: latestRace?.score || seasonPoints / 5,
      isUser: true,
    };

    const merged = [...baseRoster];
    const alreadyHasUser = merged.some(
      (entry) =>
        entry.username === userEntry.username ||
        entry.displayName === userEntry.displayName
    );
    if (!alreadyHasUser) {
      merged.push(userEntry);
    } else {
      merged.push({ ...userEntry, username: `${userEntry.username}-self` });
    }

    return merged
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [closedRaces, roster, profile, seasonPoints, formPoints, latestRace]);

  return (
    <div className="player-leaderboard-page">
      <header className="player-leaderboard-hero">
        <div className="player-leaderboard-copy">
          <p className="player-eyebrow">Rangliste</p>
          <h1>Saison-Ranking & Race-Insights</h1>
          <p className="player-sub">
            Punkte basieren auf offiziellen Ergebnissen vs. deinen Tipps. Die
            Saison-Rangliste kombiniert alle abgeschlossenen Rennen; dazu gibt es
            eine Renn-Bewertung und eine Formkurve.
          </p>
          <div className="player-badge-row">
            <span className="player-badge">Saisonpunkte: {seasonPoints}</span>
            <span className="player-badge accent">
              Rennen beendet: {closedRaces.length}
            </span>
            <span className="player-badge muted">
              Gespeicherte Tipps: {Object.keys(tips || {}).length}
            </span>
          </div>
          <div className="player-hero-actions">
            <button type="button" onClick={() => navigate("/player/races")}>
              Zu den Rennen
            </button>
            <button
              type="button"
              className="player-ghost-btn"
              onClick={() => navigate("/player/profile")}
            >
              Profil ansehen
            </button>
          </div>
        </div>

        <div className="leaderboard-hero-stats">
          <div className="leaderboard-hero-card">
            <span>Avg. Punkte/Rennen</span>
            <strong>{raceStats.length ? formPoints : 0}</strong>
            <p>{raceStats.length ? "Basierend auf den letzten 3 Rennen" : "Noch keine Rennen abgeschlossen"}</p>
          </div>
          <div className="leaderboard-hero-card">
            <span>Trefferquote</span>
            <strong>{accuracyAverage}%</strong>
            <p>Exakte Positionen vs. offizielle Top 10</p>
          </div>
          <div className="leaderboard-hero-card">
            <span>Bestes Event</span>
            <strong>{bestRace ? bestRace.track : "Noch offen"}</strong>
            <p>
              {bestRace
                ? `${bestRace.score} Punkte · ${formatDate(bestRace.date)}`
                : "Sobald ein Rennen geschlossen ist, erscheint es hier."}
            </p>
          </div>
        </div>
      </header>

      <section className="leaderboard-section">
        <div className="leaderboard-section-head">
          <div>
            <p className="player-eyebrow muted">Season</p>
            <h2>Saison-Rangliste</h2>
            <p className="player-sub">
              Kombination aus allen abgeschlossenen Rennen. Dein Platz wird
              hervorgehoben, Rivalen sind als Referenz gesetzt.
            </p>
          </div>
          <div className="leaderboard-pill">
            {latestRace
              ? `Letztes Rennen: ${latestRace.track} · ${formatDate(latestRace.date)}`
              : "Noch kein Rennen abgeschlossen"}
          </div>
        </div>

        <div className="leaderboard-table">
          {leaderboardRows.map((row) => {
            const teamClassName = teamClass(row.team);
            const accent = TEAM_COLOR_PALETTE[teamClassName] || "#161925";

            return (
              <article
                key={row.username}
                className={`leaderboard-row ${row.rank === 1 ? "is-top" : ""} ${
                  row.isUser ? "is-self" : ""
                }`}
              >
                <div className="leaderboard-rank">#{row.rank}</div>
                <div className="leaderboard-user">
                  <div
                    className={`leaderboard-avatar ${teamClassName}`}
                    style={{ background: accent }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="leaderboard-name">
                      {row.displayName}{" "}
                      {row.isUser && <span className="leaderboard-chip">Du</span>}
                    </div>
                    <div className="leaderboard-meta">
                      {row.team} • {row.country}
                    </div>
                  </div>
                </div>
                <div className="leaderboard-points">
                  <strong>{row.points}</strong>
                  <span>Pts</span>
                </div>
                <div className="leaderboard-form">
                  <span className="leaderboard-label">Form</span>
                  <strong>{row.form}</strong>
                </div>
                <div className="leaderboard-last">
                  <span className="leaderboard-label">Letztes Rennen</span>
                  <strong>+{Math.round(row.lastRacePoints)} P</strong>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="leaderboard-section">
        <div className="leaderboard-section-head">
          <div>
            <p className="player-eyebrow muted">Race Day</p>
            <h2>Renn-Bewertungen</h2>
            <p className="player-sub">
              Wie gut passten deine Tipps zu den offiziellen Ergebnissen? Punkte,
              exakte Treffer und dein bester Pick je Event.
            </p>
          </div>
          <div className="leaderboard-actions">
            <button
              type="button"
              className="player-ghost-btn"
              onClick={() => navigate("/player/races")}
            >
              Nächstes Tippfenster
            </button>
          </div>
        </div>

        {sortedRaceStats.length === 0 ? (
          <div className="player-empty">
            <p>Noch kein Rennen geschlossen. Sobald Ergebnisse gepflegt sind, erscheint hier die Rennbewertung.</p>
          </div>
        ) : (
          <div className="leaderboard-race-grid">
            {sortedRaceStats.map((race) => (
              <article key={race.id} className="leaderboard-race-card">
                <div
                  className="leaderboard-race-media"
                  style={{
                    backgroundImage: `${race.visual.pattern}, ${race.visual.gradient}`,
                  }}
                />
                <div className="leaderboard-race-body">
                  <div className="leaderboard-race-head">
                    <div>
                      <p className="player-eyebrow">{race.track}</p>
                      <h3>{formatDate(race.date)}</h3>
                      <p className="player-sub">
                        Offizielle Gewinner: {race.winner || "TBA"}
                      </p>
                    </div>
                    <div className="leaderboard-race-score">
                      <span>Punkte</span>
                      <strong>{race.score}</strong>
                    </div>
                  </div>
                  <div className="leaderboard-race-meta">
                    <div className="leaderboard-meta-tile">
                      <span>Exakt</span>
                      <strong>{race.exact}</strong>
                    </div>
                    <div className="leaderboard-meta-tile">
                      <span>Knapp daneben</span>
                      <strong>{race.near}</strong>
                    </div>
                    <div className="leaderboard-meta-tile">
                      <span>In Top 10</span>
                      <strong>{race.inTop}</strong>
                    </div>
                    <div className="leaderboard-meta-tile">
                      <span>Accuracy</span>
                      <strong>{race.accuracy}%</strong>
                    </div>
                  </div>
                  <div className="leaderboard-race-bottom">
                    <div className="leaderboard-badge-row">
                      <span className="leaderboard-badge">
                        Bester Pick: {race.bestPick?.driver || "Keiner"}
                      </span>
                      <span className="leaderboard-badge muted">
                        Dein #1 Tipp: {race.tip[0] || "Nicht gesetzt"}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="player-ghost-btn"
                      onClick={() => navigate(`/player/race/${race.id}/tips`)}
                    >
                      Tipp ansehen
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="leaderboard-section">
        <div className="leaderboard-section-head">
          <div>
            <p className="player-eyebrow muted">Extras</p>
            <h2>Form, Konstanz & Anstehendes</h2>
            <p className="player-sub">
              Kurze Auswertung deiner Saison: Formkurve, Treffer-Quote und was
              als Nächstes ansteht.
            </p>
          </div>
        </div>

        <div className="leaderboard-mini-grid">
          <article className="leaderboard-mini-card">
            <span className="leaderboard-label">Formkurve (letzte 3)</span>
            <strong>{formPoints} Punkte</strong>
            <p className="player-sub">
              Durchschnitt der letzten drei Events. Hält die Pace stabil?
            </p>
          </article>
          <article className="leaderboard-mini-card">
            <span className="leaderboard-label">Trefferquote</span>
            <strong>{accuracyAverage}%</strong>
            <p className="player-sub">
              Exakte Positionen in der Top 10 im Vergleich zu den offiziellen
              Ergebnissen.
            </p>
          </article>
          <article className="leaderboard-mini-card">
            <span className="leaderboard-label">Nächste Schritte</span>
            {races.length === 0 ? (
              <p className="player-sub">Noch keine Rennen geplant.</p>
            ) : (
              <p className="player-sub">
                {races.filter((race) => race.status !== "closed").length > 0
                  ? "Tippen öffnen, bevor das nächste Rennen geschlossen wird."
                  : "Alle Rennen sind abgeschlossen - Zeit für neue Saison!"}
              </p>
            )}
            <div className="leaderboard-mini-actions">
              <button type="button" onClick={() => navigate("/player/races")}>
                Rennkalender
              </button>
              <button
                type="button"
                className="player-ghost-btn"
                onClick={() => navigate("/player")}
              >
                Zum Dashboard
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default PlayerLeaderboardPage;
