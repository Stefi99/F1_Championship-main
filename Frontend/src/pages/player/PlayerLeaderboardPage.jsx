/**
 * PlayerLeaderboardPage - Zeigt die komplette Saisonrangliste
 *
 * Diese Seite zeigt:
 * - Saison-Rangliste (alle Spieler sortiert nach Punkten)
 * - Renn-Bewertungen (wie gut waren die Tipps pro Rennen)
 * - Statistiken (Formkurve, Trefferquote, bestes Rennen)
 * - Vergleich der eigenen Tipps mit offiziellen Ergebnissen
 *
 * Die Punkte werden vom Backend berechnet und basieren auf der
 * Genauigkeit der Tipps im Vergleich zu den offiziellen Ergebnissen.
 */
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";
import { TEAM_CLASS_MAP } from "../../data/drivers";
import { getTrackVisual } from "../../data/tracks";
import { loadPlayerProfile } from "../../utils/profile";
import { loadPlayerTips } from "../../utils/tips";
import { getAllRaces } from "../../services/raceService.js";
import { getLeaderboard } from "../../services/leaderboardService.js";

/**
 * TEAM_COLOR_PALETTE - Farbzuordnung für Teams
 *
 * Wird verwendet zum Gestalten von Avataren, Chips und Row-Akzenten
 * in der Rangliste.
 */
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

/**
 * POSITION_POINTS - F1-ähnliche Punkteskala für genaue Treffer
 *
 * Punkte werden vergeben für:
 * - Exakte Position: Volle Punkte (25, 18, 15, ...)
 * - Knapp daneben (±1 Position): 50% der Punkte
 * - In Top 10: 3 Punkte
 * - Podium komplett richtig: +6 Bonus
 * - Sieger richtig: +5 Bonus
 */
const POSITION_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 3, 2];

/**
 * Datumshilfsfunktionen für Sortierung und Anzeige
 */

/**
 * parseDate - Konvertiert einen Datumswert in ein Date-Objekt
 *
 * @param {string|Date} value - Datumswert
 * @returns {Date|null} Date-Objekt oder null wenn ungültig
 */
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * formatDate - Formatiert ein Datum für die Anzeige
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
 * teamClass - Liefert CSS-Teamklasse für grafische Darstellung im UI
 *
 * @param {string} teamName - Name des Teams
 * @returns {string} CSS-Klasse für das Team
 */
const teamClass = (teamName) => TEAM_CLASS_MAP[teamName] || "team-default";

/**
 * scoreTipAgainstResults - Kernlogik für die Auswertung eines Tipps
 *
 * Vergleicht die getippte Reihenfolge mit den offiziellen Ergebnissen
 * und berechnet Punkte basierend auf:
 * - Exakte Positionen
 * - Knapp daneben (±1 Position)
 * - In Top 10
 * - Bonus für Podium und Sieger
 *
 * @param {Array<string>} tipOrder - Getippte Reihenfolge (Top 10)
 * @param {Array<string>} resultsOrder - Offizielle Reihenfolge (Top 10)
 * @returns {Object} Objekt mit score, exact, near, inTop, accuracy, bestPick
 */
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
      detail.points = Math.max(
        6,
        Math.round((POSITION_POINTS[index] || 4) * 0.5)
      );
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

// HINWEIS: buildSeedOpponents wurde entfernt, da Leaderboard jetzt vom Backend kommt

function PlayerLeaderboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [races, setRaces] = useState([]);
  const [tips, setTips] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Lädt alle benötigten Daten vom Backend
   *
   * Lädt parallel:
   * - Alle Rennen
   * - Spielerprofil
   * - Gespeicherte Tipps (nur wenn User eingeloggt)
   * - Leaderboard (Rangliste aller Spieler)
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Rennen vom Backend laden
        const racesData = await getAllRaces();
        setRaces(racesData);

        // Profil vom Backend laden
        const profileData = await loadPlayerProfile();
        setProfile(profileData);

        // Tipps vom Backend laden (nur wenn User eingeloggt ist)
        if (user?.id) {
          const tipsData = await loadPlayerTips(user.id);
          setTips(tipsData);
        }

        // Leaderboard vom Backend laden
        const leaderboardData = await getLeaderboard();
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        setRaces([]);
        setTips({});
        setProfile(null);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filtert nur vollständig geschlossene Rennen, die offizielle Ergebnisse besitzen
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

  // Für jedes geschlossene Rennen wird eine Statistik berechnet
  const raceStats = useMemo(() => {
    return closedRaces.map((race) => {
      const entry = tips?.[race.id] || {};
      const order = entry.order || entry;
      const scoring = scoreTipAgainstResults(
        order || [],
        race.resultsOrder || []
      );
      return {
        ...race,
        ...scoring,
        visual: getTrackVisual(race.track),
        tip: Array.isArray(order) ? order.slice(0, 10) : [],
        winner: race.resultsOrder?.[0],
      };
    });
  }, [closedRaces, tips]);

  // Sortiert die Rennen chronologisch
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

  // Saisonpunkte kommen direkt vom Backend (bereits berechnet)
  const seasonPoints = useMemo(() => {
    if (!profile) return 0;
    return Number.isNaN(Number(profile.points)) ? 0 : Number(profile.points);
  }, [profile?.points]);

  // Durchschnittliche Trefferquote über alle Rennen.
  const accuracyAverage = raceStats.length
    ? Math.round(
        raceStats.reduce((sum, race) => sum + race.accuracy, 0) /
          raceStats.length
      )
    : 0;

  // Durchschnittspunkte der letzten drei Events.
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

  // Identifizieren das beste Rennen und das zuletzt abgeschlossene Rennen.
  const latestRace = sortedRaceStats[0] || null;

  // Baut die Ranglisteneinträge aus Backend-Daten
  const leaderboardRows = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) {
      return [];
    }

    // Leaderboard-Daten vom Backend verwenden
    // Backend liefert bereits: username, displayName, points, rank
    return leaderboard.map((entry) => {
      // Prüfe ob dieser Eintrag der aktuelle User ist
      const isCurrentUser =
        user &&
        (entry.username === user.username ||
          entry.displayName === user.displayName);

      // Hole zusätzliche Daten aus dem Profil, falls es der aktuelle User ist
      const team = isCurrentUser
        ? profile?.favoriteTeam || "Eigenes Team"
        : "Eigenes Team"; // Backend liefert kein Team, könnte später erweitert werden
      const country = isCurrentUser ? profile?.country || "CH" : "CH"; // Backend liefert kein Country, könnte später erweitert werden

      // Form und lastRacePoints können aus raceStats berechnet werden (optional)
      // Für jetzt verwenden wir Platzhalter
      const form = isCurrentUser ? formPoints : 0;
      const lastRacePoints = isCurrentUser ? latestRace?.score || 0 : 0;

      return {
        username: entry.username,
        displayName: entry.displayName,
        team,
        country,
        points: entry.points || 0,
        rank: entry.rank || 0,
        form,
        lastRacePoints,
        isUser: isCurrentUser,
      };
    });
  }, [leaderboard, user, profile, formPoints, latestRace]);

  return (
    <div className="player-leaderboard-page">
      <header className="player-leaderboard-hero">
        <div className="player-leaderboard-copy">
          <p className="player-eyebrow">Rangliste</p>
          <h1>Saison-Ranking & Race-Insights</h1>
          <p className="player-sub">
            Punkte basieren auf offiziellen Ergebnissen vs. deinen Tipps. Die
            Saison-Rangliste kombiniert alle abgeschlossenen Rennen; dazu gibt
            es eine Renn-Bewertung und eine Formkurve.
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
            <p>
              {raceStats.length
                ? "Basierend auf den letzten 3 Rennen"
                : "Noch keine Rennen abgeschlossen"}
            </p>
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
              ? `Letztes Rennen: ${latestRace.track} · ${formatDate(
                  latestRace.date
                )}`
              : "Noch kein Rennen abgeschlossen"}
          </div>
        </div>

        <div className="leaderboard-table">
          {leaderboardRows.map((row) => {
            const teamClassName = teamClass(row.team);
            const accent = TEAM_COLOR_PALETTE[teamClassName] || "#161925";

            // Darstellung der kompletten Ranglisten-Seite
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
                      {row.isUser && (
                        <span className="leaderboard-chip">Du</span>
                      )}
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
              Wie gut passten deine Tipps zu den offiziellen Ergebnissen?
              Punkte, exakte Treffer und dein bester Pick je Event.
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
            <p>
              Noch kein Rennen geschlossen. Sobald Ergebnisse gepflegt sind,
              erscheint hier die Rennbewertung.
            </p>
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
