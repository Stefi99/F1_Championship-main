import { useEffect, useState } from "react";
import {
  getStoredDrivers,
  getDriverTeam,
  TEAM_CLASS_MAP,
} from "../../data/drivers";

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

  const teamLabel = (driverName) =>
    getDriverTeam(driverName) ||
    driversByName[driverName]?.team ||
    "Team unbekannt";

  useEffect(() => {
    const driverList = getStoredDrivers();
    const map = driverList.reduce((acc, d) => {
      acc[d.name] = d;
      return acc;
    }, {});
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDriversByName(map);

    const stored = loadRaces();
    setRaces(stored);
    if (stored.length > 0) {
      const firstId = String(stored[0].id);
      setSelectedId(firstId);
      const firstRace = stored[0];
      const initialOrder = firstRace.resultsOrder?.length
        ? firstRace.resultsOrder
        : firstRace.drivers?.length
        ? firstRace.drivers
        : driverList.map((d) => d.name);
      setResultsOrder(initialOrder);
    }
  }, []);

  // Wenn Auswahl wechselt, vorhandene Ergebnisse des Rennens laden
  useEffect(() => {
    if (!selectedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      : driverList.map((d) => d.name);
    setResultsOrder(initialOrder || []);
  }, [selectedId, races, driversByName]);

  const handleSave = () => {
    if (!selectedId) {
      alert("Bitte zuerst ein Rennen auswählen");
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
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    moveItem(dragIndex, index);
    setDragIndex(null);
  };

  if (races.length === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Offizielle Ergebnisse</h1>
        <p>Keine Rennen erfasst. Bitte zuerst Rennen anlegen.</p>
      </div>
    );
  }

  const currentRace = races.find(
    (race) => String(race.id) === String(selectedId)
  );
  const hasDrivers =
    resultsOrder.length > 0 || (currentRace?.drivers || []).length > 0;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1>Offizielle Ergebnisse</h1>
      <p>
        Rangfolge per Drag und Drop anordnen oder zufällig mischen. Danach
        speichern, um den Status auf "closed" zu setzen.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ minWidth: "260px" }}
        >
          {races.map((race) => (
            <option key={race.id} value={race.id}>
              {race.track} - {race.date || "Datum fehlt"}
            </option>
          ))}
        </select>
        <button onClick={shuffleOrder}>Zufallsreihenfolge</button>
      </div>

      {currentRace && (
        <div style={{ marginBottom: "1rem", color: "#e1e1e1ff" }}>
          <div>
            <strong>Strecke:</strong> {currentRace.track}
          </div>
          <div>
            <strong>Datum:</strong> {currentRace.date || "-"}
          </div>
          <div>
            <strong>Status:</strong> {currentRace.status || "-"}
          </div>
          <div>
            <strong>Wetter:</strong> {currentRace.weather || "-"}
          </div>
        </div>
      )}

      {!hasDrivers ? (
        <p>
          Keine Fahrer im Rennen hinterlegt. Bitte im Rennen Fahrer zuweisen
          oder "Teilnehmer laden" verwenden.
        </p>
      ) : (
        <div className="result-list">
          {resultsOrder.map((driver, index) => (
            <div
              key={driver}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className={`result-row ${teamClass(driver)}`}
            >
              <div className="result-row-info">
                <div className="result-row-position">#{index + 1}</div>
                <div className="result-row-text">
                  <div className="result-row-name">{driver}</div>
                  <div className="result-row-team">{teamLabel(driver)}</div>
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

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
        <button onClick={handleSave} disabled={!hasDrivers}>
          Ergebnisse speichern
        </button>
      </div>
    </div>
  );
}

export default AdminOfficialResultsPage;
