import { useEffect, useState } from "react";
import {
  getStoredDrivers,
  saveDrivers,
  TEAM_OPTIONS,
  defaultDrivers,
} from "../../data/drivers";

// Seite fuer die Verwaltung der Fahrer (Admin-Bereich)
function AdminDriversListPage() {
  const [drivers, setDrivers] = useState([]);

  const loadRaces = () => JSON.parse(localStorage.getItem("races") || "[]");
  const saveRaces = (list) =>
    localStorage.setItem("races", JSON.stringify(list));

  useEffect(() => {
    const stored = getStoredDrivers();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrivers(stored);
  }, []);

  const handleChangeTeam = (id, team) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, team } : d)));
  };

  const handleChangeName = (id, name) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  };

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

  const handleSave = () => {
    const previousDrivers = getStoredDrivers();
    // Persist drivers (with stable ids)
    saveDrivers(drivers);
    applyRenamesToRaces(drivers, previousDrivers);
    alert("Fahrer gespeichert");
  };

  const handleReset = () => {
    const previousDrivers = getStoredDrivers();
    setDrivers(defaultDrivers);
    saveDrivers(defaultDrivers);
    applyRenamesToRaces(defaultDrivers, previousDrivers);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1>Fahrer verwalten</h1>
      <p>
        Namen und Team-Zuordnung ändern. Änderungen wirken automatisch in
        Rennen, Ergebnissen und Farben.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={handleSave}>Speichern</button>
        <button onClick={handleReset}>Auf Standard zurücksetzen</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {drivers.map((driver) => (
          <div
            key={driver.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "0.75rem",
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              Fahrername
              <input
                type="text"
                value={driver.name}
                onChange={(e) => handleChangeName(driver.id, e.target.value)}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                marginTop: "0.5rem",
              }}
            >
              Team
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
    </div>
  );
}

export default AdminDriversListPage;
