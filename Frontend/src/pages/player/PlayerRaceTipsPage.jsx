// Seite zur Abgabe oder Ansicht der persönlichen Tipps für ein bestimmtes Rennen
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStoredDrivers,
  getDriverTeam,
  TEAM_CLASS_MAP,
} from "../../data/drivers";
import { getTrackVisual } from "../../data/tracks";
import { getRaceTip, persistRaceTip } from "../../utils/tips";
import { getRaceById } from "../../services/raceService.js";

// Farbzuordnung der Teams für visuelle Hervorhebung in Tipp- und Ergebnislisten
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
};

// UI-Beschriftungen für Rennstatus und Wetteranzeigen.
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

// Hilfsfunktionen zur formatierten Ausgabe von Datum und Zeit.
const formatDate = (value) => {
  if (!value) return "Datum folgt";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("de-DE");
};

const formatDateTime = (value, fallback = "Noch kein Tipp") => {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toLocaleString("de-DE");
};

function PlayerRaceTipsPage() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const [race, setRace] = useState(null);
  const [selection, setSelection] = useState([]);
  const [available, setAvailable] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [driversByName, setDriversByName] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // Hauptroutine zum Synchronisieren aller relevanten Daten
  const syncData = useCallback(async () => {
    const driverList = getStoredDrivers();
    const map = driverList.reduce((acc, driver) => {
      acc[driver.name] = driver;
      return acc;
    }, {});
    setDriversByName(map);

    // Rennen vom Backend laden
    try {
      const current = await getRaceById(raceId);
      setRace(current);

      // Backend hat kein "drivers" Feld direkt, verwendet resultsOrder oder alle Fahrer
      const allDrivers = driverList.map((driver) => driver.name);

      const tip = getRaceTip(raceId);
      const savedOrder = (tip?.order || []).filter((name) =>
        allDrivers.includes(name)
      );

      const initialSelection =
        savedOrder.length > 0
          ? savedOrder.slice(0, 10)
          : allDrivers.slice(0, 10);
      const remaining = allDrivers.filter(
        (name) => !initialSelection.includes(name)
      );

      setSelection(initialSelection);
      setAvailable(remaining);
      setLastSavedAt(tip?.updatedAt || null);
      setMessage("");
      setError("");
    } catch (error) {
      console.error("Fehler beim Laden des Rennens:", error);
      setError("Rennen konnte nicht geladen werden.");
      setRace(null);
    }
  }, [raceId]);

  // Lädt alle Tipp- und Renninformationen beim Seitenstart
  useEffect(() => {
    syncData();
  }, [syncData]);

  // Teambezogene Hilfsfunktionen für Darstellung und Teamfarben
  const teamClass = (driverName) => {
    const team = getDriverTeam(driverName) || driversByName[driverName]?.team;
    return TEAM_CLASS_MAP[team] || "team-default";
  };

  const teamLabel = (driverName) =>
    getDriverTeam(driverName) ||
    driversByName[driverName]?.team ||
    "Team unbekannt";

  const teamColor = (driverName) => {
    const className = teamClass(driverName);
    return TEAM_COLOR_PALETTE[className] || "var(--f1-red)";
  };

  // Memoisierte Ableitungen
  const trackVisual = useMemo(() => getTrackVisual(race?.track), [race?.track]);

  const officialOrder = useMemo(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    () =>
      Array.isArray(race?.resultsOrder)
        ? race.resultsOrder.filter(Boolean)
        : [],
    [race?.resultsOrder]
  );

  const officialTopTen = useMemo(
    () => officialOrder.slice(0, 10),
    [officialOrder]
  );

  const hasOfficialResults =
    race?.status === "closed" && officialOrder.length > 0;

  const canTip = race?.status === "voting";
  const statusText = statusLabel[race?.status] || statusLabel.open;
  const lastSavedText = formatDateTime(lastSavedAt);

  // Verschiebt einen Fahrer innerhalb der Top-10-Auswahl
  const moveItem = (from, to) => {
    if (from === null || to === null || from === to) return;
    setSelection((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  // Steuerung der Drag & Drop Interaktion
  const handleDragStart = (index) => {
    if (!canTip) return;
    setDragIndex(index);
  };

  const handleDragOver = (event) => {
    if (!canTip) return;
    event.preventDefault();
  };

  const handleDrop = (index) => {
    if (!canTip) return;
    if (dragIndex === null) return;
    moveItem(dragIndex, index);
    setDragIndex(null);
  };

  // Fügt einen Fahrer aus dem verfügbaren Pool zur Top 10 hinzu
  const handleAddDriver = (driverName) => {
    if (selection.includes(driverName)) return;
    if (selection.length >= 10) {
      setError("Maximal 10 Fahrer tippen.");
      return;
    }
    setSelection((prev) => [...prev, driverName]);
    setAvailable((prev) => prev.filter((name) => name !== driverName));
    setError("");
    setMessage("");
  };

  // Entfernt einen Fahrer aus der Top 10 und legt ihn zurück in den Fahrerpool
  const handleRemoveDriver = (driverName) => {
    setSelection((prev) => prev.filter((name) => name !== driverName));
    setAvailable((prev) =>
      prev.includes(driverName) ? prev : [...prev, driverName]
    );
  };

  // Speichert den Tipp des Spielers
  const handleSave = () => {
    if (!race) {
      setError("Rennen wurde nicht gefunden.");
      return;
    }
    if (selection.length === 0) {
      setError("Bitte mindestens einen Fahrer für die Top 10 auswählen.");
      return;
    }
    const entry = persistRaceTip(raceId, selection);
    setLastSavedAt(entry.updatedAt);
    setMessage(
      "Tipp gespeichert. Nur die ersten 10 Positionen werden gewertet."
    );
    setError("");
  };

  if (!race) {
    return (
      <div className="player-tip-page">
        <div className="player-empty">
          <p>Rennen nicht gefunden.</p>
          <button type="button" onClick={() => navigate("/player/races")}>
            Zur Rennliste
          </button>
        </div>
      </div>
    );
  }

  // Darstellung der Tippsseite
  return (
    <div className="player-tip-page">
      <header className="player-tip-hero">
        <div className="player-tip-hero-left">
          <p className="player-eyebrow">Mein Tipp</p>
          <h1>{race.track || "Rennen"}</h1>
          <p className="player-sub">
            Ordne deine Top 10 wie beim Admin-Ergebnis ein, nur dass hier
            höchstens die Plätze 1 bis 10 vergeben werden können.
          </p>
          <div className="player-badge-row">
            <span className="player-badge">Status: {statusText}</span>
            <span className="player-badge accent">Nur Top 10</span>
            <span className="player-badge muted">
              Letztes Update: {lastSavedText}
            </span>
          </div>
          <div className="player-hero-actions">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canTip || selection.length === 0}
            >
              Tipp speichern
            </button>
            <button
              type="button"
              className="player-ghost-btn"
              onClick={() => navigate("/player/races")}
            >
              Zur Rennliste
            </button>
          </div>
        </div>
        <div className="player-tip-hero-right">
          <div
            className="player-tip-track"
            style={{
              backgroundImage: `${trackVisual.pattern}, ${trackVisual.gradient}`,
            }}
            aria-hidden="true"
          />
          <div className="player-tip-meta">
            <div className="player-tip-meta-card">
              <span>Datum</span>
              <strong>{formatDate(race.date)}</strong>
            </div>
            <div className="player-tip-meta-card">
              <span>Wetter</span>
              <strong>{weatherLabel[race.weather] || "Wetter folgt"}</strong>
            </div>
            <div className="player-tip-meta-card">
              <span>Letzter Tipp</span>
              <strong>{lastSavedText}</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="player-tip-shell">
        {(message || error) && (
          <div className={`player-alert ${error ? "is-error" : "is-success"}`}>
            {error || message}
          </div>
        )}

        <section className="player-tip-panel">
          <div className="player-tip-panel-head">
            <div>
              <p className="player-eyebrow">Top 10 setzen</p>
              <h2>Fahrer platzieren</h2>
              <p className="player-sub">
                Drag & Drop oder Up/Down wie im Admin-Bereich. Es werden nur die
                Plätze 1-10 gespeichert.
              </p>
            </div>
            <div className="player-tip-actions">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canTip || selection.length === 0}
              >
                Tipp speichern
              </button>
              <button
                type="button"
                className="player-ghost-btn"
                onClick={syncData}
              >
                Zurücksetzen
              </button>
            </div>
          </div>
          <div className="player-tip-limit">
            Maximal 10 Positionen. Aktuell {selection.length} Fahrer gesetzt.
          </div>

          {selection.length === 0 ? (
            <div className="player-empty">
              <p>Kein Fahrer ausgewählt. Füge Fahrer aus dem Pool hinzu.</p>
            </div>
          ) : (
            <div className="result-list">
              {selection.map((driver, index) => {
                const officialIndex = hasOfficialResults
                  ? officialTopTen.indexOf(driver)
                  : -1;
                const isCorrectPosition =
                  hasOfficialResults && officialIndex === index;
                const isMissingOfficial =
                  hasOfficialResults && officialIndex === -1;
                const isDifferentPosition =
                  hasOfficialResults &&
                  officialIndex !== -1 &&
                  officialIndex !== index;

                return (
                  <div
                    key={driver}
                    draggable={canTip}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className={`result-row ${teamClass(driver)} ${
                      index >= 10 ? "is-muted" : ""
                    } ${isDifferentPosition ? "is-off-position" : ""} ${
                      isMissingOfficial ? "is-missing-position" : ""
                    } ${isCorrectPosition ? "is-correct-position" : ""}`}
                    style={{ "--result-accent": teamColor(driver) }}
                  >
                    <div className="result-row-info">
                      <div className="result-row-position">#{index + 1}</div>
                      <span className="result-team-swatch" aria-hidden="true" />
                      <div className="result-row-text">
                        <div className="result-row-name">{driver}</div>
                        <div className="result-row-team">
                          {teamLabel(driver)}
                        </div>
                        {hasOfficialResults && (
                          <div
                            className={`result-row-official ${
                              isCorrectPosition
                                ? "is-match"
                                : isMissingOfficial
                                ? "is-missing"
                                : "is-different"
                            }`}
                          >
                            Offiziell:{" "}
                            <strong>
                              {officialIndex >= 0
                                ? `P${officialIndex + 1}`
                                : "kein Ergebnis"}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="result-row-actions">
                      <button
                        type="button"
                        className="result-row-btn"
                        onClick={() => moveItem(index, index - 1)}
                        disabled={!canTip || index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="result-row-btn"
                        onClick={() => moveItem(index, index + 1)}
                        disabled={!canTip || index === selection.length - 1}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className="result-row-btn"
                        onClick={() => handleRemoveDriver(driver)}
                        disabled={!canTip}
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="player-tip-panel">
          <div className="player-tip-panel-head">
            <div>
              <p className="player-eyebrow muted">Fahrerpool</p>
              <h3>Weitere Fahrer hinzufügen</h3>
              <p className="player-sub">
                Wähle aus den restlichen Fahrern und füge sie deinem Top-10 Tipp
                hinzu.
              </p>
            </div>
            <div className="player-tip-limit">
              Verfügbar: {available.length} Fahrer
            </div>
          </div>

          {available.length === 0 ? (
            <p className="player-sub">
              Alle Fahrer sind bereits in deinem Tipp oder kein weiterer Fahrer
              vorhanden.
            </p>
          ) : (
            <div className="player-available-grid">
              {available.map((driver) => (
                <button
                  key={driver}
                  type="button"
                  className={`player-available-chip ${teamClass(driver)}`}
                  onClick={() => handleAddDriver(driver)}
                  disabled={!canTip || selection.length >= 10}
                >
                  {driver}
                </button>
              ))}
            </div>
          )}
        </section>

        {hasOfficialResults && (
          <section className="player-tip-panel">
            <div className="player-tip-panel-head">
              <div>
                <p className="player-eyebrow muted">Referenz</p>
                <h3>Offizielles Ergebnis</h3>
                <p className="player-sub">
                  Gespeichert vom Admin. Nutze die finale Reihenfolge, um deine
                  Tipps für kommende Rennen zu verbessern.
                </p>
              </div>
              <div className="player-tip-limit">
                {officialTopTen.length} Fahrer mit Wertung
              </div>
            </div>

            {officialTopTen.length === 0 ? (
              <div className="player-empty">
                <p>Kein offizielles Ergebnis hinterlegt.</p>
              </div>
            ) : (
              <div className="result-list">
                {officialTopTen.map((driver, index) => (
                  <div
                    key={`${driver}-${index}`}
                    className={`result-row read-only ${teamClass(driver)}`}
                    style={{ "--result-accent": teamColor(driver) }}
                  >
                    <div className="result-row-info">
                      <div className="result-row-position">#{index + 1}</div>
                      <span className="result-team-swatch" aria-hidden="true" />
                      <div className="result-row-text">
                        <div className="result-row-name">{driver}</div>
                        <div className="result-row-team">
                          {teamLabel(driver)}
                        </div>
                      </div>
                    </div>
                    <div className="result-row-badge">Offiziell</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default PlayerRaceTipsPage;
