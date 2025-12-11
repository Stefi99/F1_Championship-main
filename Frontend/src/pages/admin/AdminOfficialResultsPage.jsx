//Seite zur Eingabe der offiziellen Rennergebnisse.
import { useEffect, useState } from "react";
import { getStoredDrivers, getDriverTeam, TEAM_CLASS_MAP } from "../../data/drivers";
import { getAllRaces, updateRaceResults } from "../../services/raceService.js";
import { ApiError } from "../../utils/api.js";

//Farbpalette für Teams zur visuellen Hervorhebung
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

// Seite für die Eingabe und Anzeige der offiziellen Rennergebnisse
function AdminOfficialResultsPage() {
  const [races, setRaces] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [resultsOrder, setResultsOrder] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [driversByName, setDriversByName] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Hilfsfunktionen zur Ermittlung von Teamfarben und Teamnamen.
  const teamClass = (driverName) => {
    const team = getDriverTeam(driverName) || driversByName[driverName]?.team;
    return TEAM_CLASS_MAP[team] || "team-default";
  };

  const teamColor = (driverName) => {
    const className = teamClass(driverName);
    return TEAM_COLOR_PALETTE[className] || "var(--f1-red)";
  };

  const teamLabel = (driverName) =>
    getDriverTeam(driverName) ||
    driversByName[driverName]?.team ||
    "Team unbekannt";

  // Laden von Fahrer-/Teamdaten, Rennen, Ergebnisse
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fahrer vom Backend laden
        const driverList = await getStoredDrivers();
        const map = driverList.reduce((acc, driver) => {
          acc[driver.name] = driver;
          return acc;
        }, {});
        setDriversByName(map);

        // Rennen vom Backend laden
        const racesData = await getAllRaces();
        setRaces(racesData);

        if (racesData.length > 0) {
          const firstRace = racesData[0];
          const firstId = String(firstRace.id);
          const initialOrder = firstRace.resultsOrder?.length
            ? firstRace.resultsOrder
            : firstRace.drivers?.length
            ? firstRace.drivers
            : driverList.map((driver) => driver.name);
          setSelectedId(firstId);
          setResultsOrder(initialOrder);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Daten:", err);
        setError("Daten konnten nicht geladen werden.");
        setRaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aktualisiert die Ergebnisliste neu, wenn Auswahl gewechselt wird
  useEffect(() => {
    if (!selectedId || loading) {
      if (!selectedId) {
        setResultsOrder([]);
      }
      return;
    }
    const current = races.find(
      (race) => String(race.id) === String(selectedId)
    );
    const driverList = Object.values(driversByName);
    const initialOrder = current?.resultsOrder?.length
      ? current.resultsOrder
      : current?.drivers?.length
      ? current.drivers
      : driverList.map((driver) => driver.name);
    setResultsOrder(initialOrder || []);
  }, [selectedId, races, driversByName, loading]);

  // Speichert die offizielle Reihenfolge des ausgewählten Rennens
  const handleSave = async () => {
    if (!selectedId) {
      setError("Bitte zuerst ein Rennen auswählen");
      return;
    }
    if (resultsOrder.length === 0) {
      setError(
        "Keine Fahrer vorhanden. Bitte zuerst Fahrer dem Rennen zuweisen."
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Ergebnisse über API speichern
      const updatedRace = await updateRaceResults(selectedId, resultsOrder);

      // Lokalen State aktualisieren
      const next = races.map((race) =>
        String(race.id) === String(selectedId)
          ? {
              ...race,
              resultsOrder: updatedRace.resultsOrder || resultsOrder,
              status: updatedRace.status || "CLOSED",
            }
          : race
      );
      setRaces(next);

      setMessage(
        "Ergebnisse erfolgreich gespeichert (Status: " +
          (updatedRace.status || "CLOSED") +
          ")"
      );
    } catch (err) {
      console.error("Fehler beim Speichern der Ergebnisse:", err);
      if (err instanceof ApiError) {
        setError(err.message || "Fehler beim Speichern der Ergebnisse.");
      } else {
        setError("Netzwerkfehler oder Server nicht erreichbar.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Erstellt eine zufällige Reihenfolge der Fahrer
  const shuffleOrder = () => {
    setResultsOrder((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  // Verschiebt einen Fahrer innerhalb der Ergebnisliste
  const moveItem = (from, to) => {
    if (from === null || to === null || from === to) return;
    setResultsOrder((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  // Drag-&-Drop Steuerung
  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    if (dragIndex === null) return;
    moveItem(dragIndex, index);
    setDragIndex(null);
  };

  const currentRace = races.find(
    (race) => String(race.id) === String(selectedId)
  );
  const hasDrivers =
    resultsOrder.length > 0 || (currentRace?.drivers || []).length > 0;
  const closedCount = races.filter(
    (race) => race.status === "closed" || race.status === "CLOSED"
  ).length;

  // Darstellung der kompletten Ergebnis-Erfassungsseite
  return (
    <div className="results-admin-page">
      <header className="results-hero">
        <div className="results-hero-text">
          <p className="admin-eyebrow">Offizielle Ergebnisse</p>
          <h1>Rangliste finalisieren</h1>
          <p className="admin-sub">
            Fahrer per Drag-and-Drop oder mit den Pfeilen verschieben. Danach
            speichern, um das Rennen zu schließen und die Reihenfolge zu
            sichern.
          </p>
          <div className="results-hero-actions">
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={shuffleOrder}
              disabled={races.length === 0 || !hasDrivers || loading}
            >
              Zufallsreihenfolge
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasDrivers || races.length === 0 || saving || loading}
            >
              {saving ? "Speichern..." : "Ergebnisse speichern"}
            </button>
          </div>
        </div>
        <div className="results-hero-stats">
          <div className="results-stat">
            <span>Rennen</span>
            <strong>{races.length}</strong>
          </div>
          <div className="results-stat">
            <span>Geschlossen</span>
            <strong>{closedCount}</strong>
          </div>
          <div className="results-stat">
            <span>Fahrer im Feld</span>
            <strong>{resultsOrder.length}</strong>
          </div>
        </div>
      </header>

      <div className="results-shell">
        {races.length === 0 ? (
          <div className="results-panel results-empty">
            <h2>Keine Rennen vorhanden</h2>
            <p className="results-panel-copy">
              Bitte zuerst ein Rennen im Bereich "Rennen" anlegen, um offizielle
              Ergebnisse einzutragen.
            </p>
          </div>
        ) : (
          <>
            <section className="results-panel">
              <div className="results-panel-head">
                <div>
                  <p className="admin-eyebrow">Rennen</p>
                  <h2>Event auswählen</h2>
                  <p className="results-panel-copy">
                    Wähle das Rennen, für das du die offizielle Reihenfolge
                    festlegen möchtest.
                  </p>
                </div>
                <div className="results-controls">
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="results-select"
                    disabled={loading}
                  >
                    {races.map((race) => (
                      <option key={race.id} value={race.id}>
                        {race.name || race.track} - {race.date || "Datum fehlt"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentRace && (
                <div className="results-meta-grid">
                  <div className="results-meta-card">
                    <span>Strecke</span>
                    <strong>{currentRace.name || currentRace.track}</strong>
                  </div>
                  <div className="results-meta-card">
                    <span>Datum</span>
                    <strong>{currentRace.date || "-"}</strong>
                  </div>
                  <div className="results-meta-card">
                    <span>Status</span>
                    <strong>{currentRace.status || "-"}</strong>
                  </div>
                  <div className="results-meta-card">
                    <span>Wetter</span>
                    <strong>{currentRace.weather || "-"}</strong>
                  </div>
                </div>
              )}

              {(error || message) && (
                <div
                  className={`results-message ${
                    error ? "results-error" : "results-success"
                  }`}
                >
                  {error || message}
                </div>
              )}
            </section>

            <section className="results-panel">
              <div className="results-panel-head">
                <div>
                  <p className="admin-eyebrow">Platzierungen</p>
                  <h2>Fahrer positionieren</h2>
                  <p className="results-panel-copy">
                    Ziehe die Fahrerkarten oder nutze Up/Down. Jede Karte zeigt
                    Position, Namen, Team und ein farbiges Team-Symbol.
                  </p>
                </div>
                <div className="results-count">
                  {resultsOrder.length} Fahrer
                </div>
              </div>

              {!hasDrivers ? (
                <div className="results-empty">
                  <h3>Keine Fahrer hinterlegt</h3>
                  <p className="results-panel-copy">
                    Füge zuerst Fahrer im Rennen hinzu, um sie hier sortieren zu
                    können.
                  </p>
                </div>
              ) : (
                <div className="result-list">
                  {resultsOrder.map((driver, index) => (
                    <div
                      key={driver}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      className="result-row"
                      style={{ "--result-accent": teamColor(driver) }}
                    >
                      <div className="result-row-info">
                        <div className="result-row-position">#{index + 1}</div>
                        <span
                          className="result-team-swatch"
                          aria-hidden="true"
                        />
                        <div className="result-row-text">
                          <div className="result-row-name">{driver}</div>
                          <div className="result-row-team">
                            {teamLabel(driver)}
                          </div>
                        </div>
                      </div>
                      <div className="result-row-actions">
                        <button
                          type="button"
                          className="result-row-btn"
                          onClick={() => moveItem(index, index - 1)}
                          disabled={index === 0}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="result-row-btn"
                          onClick={() => moveItem(index, index + 1)}
                          disabled={index === resultsOrder.length - 1}
                        >
                          Down
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="results-action-row">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    !hasDrivers || races.length === 0 || saving || loading
                  }
                >
                  {saving ? "Speichern..." : "Ergebnisse speichern"}
                </button>
                <button
                  type="button"
                  className="admin-ghost-btn"
                  onClick={shuffleOrder}
                  disabled={!hasDrivers || loading}
                >
                  Zufallsreihenfolge
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminOfficialResultsPage;
