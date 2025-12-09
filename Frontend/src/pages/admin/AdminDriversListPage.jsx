import { useEffect, useState } from "react";
import {
  getStoredDrivers,
  saveDrivers,
  TEAM_OPTIONS,
  defaultDrivers,
} from "../../data/drivers";

// Seite für die Verwaltung der Fahrer (Admin-Bereich)
function AdminDriversListPage() {
  const [drivers, setDrivers] = useState([]);

  // Hilfsfunktionen zum Laden und Speichern der Rennen
  const loadRaces = () => JSON.parse(localStorage.getItem("races") || "[]");
  const saveRaces = (list) =>
    localStorage.setItem("races", JSON.stringify(list));

  // Lädt die gespeicherten Fahrer beim ersten Rendern.
  useEffect(() => {
    const stored = getStoredDrivers();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrivers(stored);
  }, []);

  //Ändert das Team eines Fahrers direkt, erst beim Speichern dauerhaft gespeichert
  const handleChangeTeam = (id, team) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, team } : d)));
  };

  //Aktualisiert den Namen eines Fahrers
  const handleChangeName = (id, name) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  };

  //Synchronisiert Namensänderungen in allen Rennen
  const applyRenamesToRaces = (updatedDrivers, previousDrivers) => {
    const prevById = (previousDrivers || []).reduce((acc, d) => {
      const key = d.id || d.name;
      acc[key] = d.name;
      return acc;
    }, {});

    const nameMap = updatedDrivers.reduce((acc, d) => {
      const key = d.id || d.name;
      const prevName = prevById[key];
      acc[key] = d.name;
      acc[d.name] = d.name;
      if (prevName) acc[prevName] = d.name; // map alter Name -> neuer Name
      return acc;
    }, {});

    const races = loadRaces();
    const updatedRaces = races.map((race) => {
      const driversNew = (race.drivers || []).map((n) => nameMap[n] || n);
      const orderNew = (race.resultsOrder || []).map((n) => nameMap[n] || n);
      const resultsText =
        orderNew.length > 0
          ? orderNew.join(", ")
          : (race.results || "")
              .split(", ")
              .map((n) => nameMap[n] || n)
              .join(", ")
              .trim();

      return {
        ...race,
        drivers: driversNew,
        resultsOrder: orderNew,
        results: resultsText || race.results,
      };
    });

    saveRaces(updatedRaces);
  };

  //Speichert die Änderungen dauerhaft
  const handleSave = () => {
    const previousDrivers = getStoredDrivers();
    // Persist drivers (mit stabilen IDs)
    saveDrivers(drivers);
    applyRenamesToRaces(drivers, previousDrivers);
    alert("Fahrer gespeichert");
  };

  // Setzt die Fahrerliste auf die Standard-Fahrer zurück
  const handleReset = () => {
    const previousDrivers = getStoredDrivers();
    setDrivers(defaultDrivers);
    saveDrivers(defaultDrivers);
    applyRenamesToRaces(defaultDrivers, previousDrivers);
  };

  const teamCount = new Set(drivers.map((d) => d.team)).size;

  // Darstellung der Fahrer-Verwaltungsoberfläche
  return (
    <div className="drivers-admin-page">
      <header className="drivers-hero">
        <div className="drivers-hero-text">
          <p className="admin-eyebrow">Fahrer verwalten</p>
          <h1>Roster & Teamfarben</h1>
          <p className="admin-sub">
            Fahrer zentral pflegen. Änderungen wirken sofort in Rennen,
            Ergebnissen und Farbcodierungen.
          </p>
          <div className="driver-hero-actions">
            <button type="button" onClick={handleSave}>
              Speichern
            </button>
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={handleReset}
            >
              Auf Standard zurücksetzen
            </button>
          </div>
        </div>

        <div className="drivers-hero-stats">
          <div className="driver-hero-stat">
            <strong>{drivers.length}</strong>
            <span>Fahrer gelistet</span>
          </div>
          <div className="driver-hero-stat">
            <strong>{teamCount}</strong>
            <span>Teams vergeben</span>
          </div>
          <div className="driver-hero-stat">
            <strong>Auto-Sync</strong>
            <span>Wirkt sofort in Rennen</span>
          </div>
        </div>
      </header>

      <section className="drivers-panel">
        <div className="drivers-panel-head">
          <div>
            <p className="admin-eyebrow">Roster bearbeiten</p>
            <h2>Namen & Teams anpassen</h2>
            <p className="driver-panel-copy">
              Saubere Schreibweisen halten Ergebnisse und Teamfarben konsistent.
              Änderungen überschreiben alle gespeicherten Rennen.
            </p>
          </div>
        </div>

        <div className="driver-grid">
          {drivers.map((driver) => (
            <div key={driver.id} className="driver-card">
              <label className="driver-field">
                <span className="driver-field-label">Fahrername</span>
                <input
                  type="text"
                  value={driver.name}
                  onChange={(e) => handleChangeName(driver.id, e.target.value)}
                />
              </label>

              <label className="driver-field">
                <span className="driver-field-label">Team</span>
                <span className="driver-field-help">
                  Bestimmt Farbkodierung und Zuordnung in allen Rennen.
                </span>
                <select
                  value={driver.team}
                  onChange={(e) => handleChangeTeam(driver.id, e.target.value)}
                >
                  {TEAM_OPTIONS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDriversListPage;
