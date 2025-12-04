import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriverTeam, TEAM_CLASS_MAP } from "../../data/drivers";

// Seite fuer die Verwaltung aller Rennen (Admin-Bereich)
function AdminRaceListPage() {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const loadRaces = () => JSON.parse(localStorage.getItem("races") || "[]");
  const persist = (list) => {
    setRaces(list);
    localStorage.setItem("races", JSON.stringify(list));
  };

  const teamClass = (driverName) => {
    const team = getDriverTeam(driverName);
    return TEAM_CLASS_MAP[team] || "team-default";
  };

  // Beim Laden vorhandene Rennen aus localStorage holen
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRaces(loadRaces());
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Rennen wirklich löschen?");
    if (!confirmDelete) return;
    const next = races.filter((race) => String(race.id) !== String(id));
    persist(next);
  };

  const handleToggleStatus = (id) => {
    const next = races.map((race) => {
      if (String(race.id) !== String(id)) return race;
      const newStatus = race.status === "closed" ? "open" : "closed";
      return { ...race, status: newStatus };
    });
    persist(next);
  };

  const handleRefresh = () => {
    setRaces(loadRaces());
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Rennen verwalten</h1>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={() => navigate("/admin/races/new")}>
          Neues Rennen anlegen
        </button>
        <button onClick={handleRefresh}>Aktualisieren</button>
        <button onClick={() => navigate("/admin/results")}>
          Offizielle Ergebnisse
        </button>
      </div>

      {races.length === 0 ? (
        <p>Keine Rennen erfasst.</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "grid",
            gap: "0.75rem",
          }}
        >
          {races.map((race) => {
            const isExpanded = String(expandedId) === String(race.id);
            const hasOrder = (race.resultsOrder || []).length > 0;
            return (
              <li
                key={race.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{race.track}</div>
                    <div style={{ fontSize: "0.95rem", color: "#555" }}>
                      {race.date || "Kein Datum"}
                    </div>
                    <div style={{ fontSize: "0.9rem" }}>
                      Status: {race.status || "-"}
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : race.id)}
                    >
                      {isExpanded ? "Details ausblenden" : "Rennen ansehen"}
                    </button>
                    <button
                      onClick={() => navigate(`/admin/races/${race.id}/edit`)}
                    >
                      Bearbeiten
                    </button>
                    <button onClick={() => handleToggleStatus(race.id)}>
                      {race.status === "closed"
                        ? "Rennen öffnen"
                        : "Rennen schliessen"}
                    </button>
                    <button onClick={() => handleDelete(race.id)}>
                      Löschen
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ display: "grid", gap: "0.35rem" }}>
                    <div>
                      <strong>Wetter:</strong> {race.weather || "-"}
                    </div>
                    <div>
                      <strong>Reifen:</strong> {race.tyres || "-"}
                    </div>
                    <div>
                      <strong>Ergebnisse:</strong>{" "}
                      {hasOrder ? (
                        <ol
                          style={{
                            paddingLeft: "1.25rem",
                            margin: "0.35rem 0",
                          }}
                        >
                          {(race.resultsOrder || []).map((driver) => (
                            <li
                              key={driver}
                              className={`driver-chip ${teamClass(driver)}`}
                              style={{ marginBottom: "0.35rem" }}
                            >
                              {driver}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        race.results || "Keine Ergebnisse eingetragen"
                      )}
                    </div>
                    <div>
                      <strong>Teilnehmende Fahrer:</strong>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.35rem",
                        }}
                      >
                        {(race.drivers || []).length === 0
                          ? "Keine Fahrer zugeordnet"
                          : (race.drivers || []).map((driver) => (
                              <span
                                key={driver}
                                className={`driver-chip ${teamClass(driver)}`}
                              >
                                {driver}
                              </span>
                            ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AdminRaceListPage;
