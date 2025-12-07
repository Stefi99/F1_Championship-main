import { useEffect, useState } from "react";
import {
  getStoredDrivers,
  getDriverTeam,
  TEAM_CLASS_MAP,
} from "../../data/drivers";

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

// Seite fuer die Eingabe und Anzeige der offiziellen Rennergebnisse
function AdminOfficialResultsPage() {
  const [races, setRaces] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [resultsOrder, setResultsOrder] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [driversByName, setDriversByName] = useState({});

  const loadRaces = () => JSON.parse(localStorage.getItem("races") || "[]");
  const persist = (list) => {
    setRaces(list);
    localStorage.setItem("races", JSON.stringify(list));
  };

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

  useEffect(() => {
    const driverList = getStoredDrivers();
    const map = driverList.reduce((acc, driver) => {
      acc[driver.name] = driver;
      return acc;
    }, {});
    setDriversByName(map);

    const stored = loadRaces();
    setRaces(stored);
    if (stored.length > 0) {
      const firstRace = stored[0];
      const firstId = String(firstRace.id);
      const initialOrder = firstRace.resultsOrder?.length
        ? firstRace.resultsOrder
        : firstRace.drivers?.length
        ? firstRace.drivers
        : driverList.map((driver) => driver.name);
      setSelectedId(firstId);
      setResultsOrder(initialOrder);
    }
  }, []);

  // Wenn Auswahl wechselt, vorhandene Ergebnisse des Rennens laden
  useEffect(() => {
    if (!selectedId) {
      setResultsOrder([]);
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
  }, [selectedId, races, driversByName]);

  const handleSave = () => {
    if (!selectedId) {
      alert("Bitte zuerst ein Rennen auswaehlen");
      return;
    }
    if (resultsOrder.length === 0) {
      alert("Keine Fahrer vorhanden. Bitte zuerst Fahrer dem Rennen zuweisen.");
      return;
    }
    const next = races.map((race) =>
      String(race.id) === String(selectedId)
        ? {
            ...race,
            resultsOrder,
            results: resultsOrder.join(", "),
            status: "closed",
          }
        : race
    );
    persist(next);
    alert("Ergebnisse gespeichert (Status: closed)");
  };

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
  const closedCount = races.filter((race) => race.status === "closed").length;

  return (
    <div className="results-admin-page">
      <header className="results-hero">
        <div className="results-hero-text">
          <p className="admin-eyebrow">Offizielle Ergebnisse</p>
          <h1>Rangliste finalisieren</h1>
          <p className="admin-sub">
            Fahrer per Drag-and-Drop oder mit den Pfeilen verschieben. Danach
            speichern, um das Rennen zu schliessen und die Reihenfolge zu
            sichern.
          </p>
          <div className="results-hero-actions">
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={shuffleOrder}
              disabled={races.length === 0 || !hasDrivers}
            >
              Zufallsreihenfolge
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasDrivers || races.length === 0}
            >
              Ergebnisse speichern
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
              Bitte zuerst ein Rennen im Bereich "Rennen" anlegen, um
              offizielle Ergebnisse einzutragen.
            </p>
          </div>
        ) : (
          <>
            <section className="results-panel">
              <div className="results-panel-head">
                <div>
                  <p className="admin-eyebrow">Rennen</p>
                  <h2>Event auswaehlen</h2>
                  <p className="results-panel-copy">
                    Waehle das Rennen, fuer das du die offizielle Reihenfolge
                    festlegen moechtest.
                  </p>
                </div>
                <div className="results-controls">
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="results-select"
                  >
                    {races.map((race) => (
                      <option key={race.id} value={race.id}>
                        {race.track} - {race.date || "Datum fehlt"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentRace && (
                <div className="results-meta-grid">
                  <div className="results-meta-card">
                    <span>Strecke</span>
                    <strong>{currentRace.track}</strong>
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
                    Fuege zuerst Fahrer im Rennen hinzu, um sie hier sortieren zu
                    koennen.
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
                  disabled={!hasDrivers || races.length === 0}
                >
                  Ergebnisse speichern
                </button>
                <button
                  type="button"
                  className="admin-ghost-btn"
                  onClick={shuffleOrder}
                  disabled={!hasDrivers}
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
