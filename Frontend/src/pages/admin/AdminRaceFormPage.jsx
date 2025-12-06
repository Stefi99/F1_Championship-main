// Formularseite zum Erstellen oder Bearbeiten eines Rennens
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStoredDrivers } from "../../data/drivers";

function AdminRaceFormPage() {
  const navigate = useNavigate();
  const { raceId } = useParams();
  const isEdit = Boolean(raceId);

  // Lokaler Formular-State
  const [track, setTrack] = useState("");
  const [weather, setWeather] = useState("");
  const [date, setDate] = useState("");
  const [tyres, setTyres] = useState("");
  const [status, setStatus] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);

  // einfache Styles passend zum F1-Rot-Akzent
  const accentColor = "#e10600";
  const cardStyle = {
    background:
      "linear-gradient(135deg, #0c0d11 0%, #10121a 55%, #0c0d11 100%)",
    border: "1px solid #1d1f27",
    borderRadius: "14px",
    boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
    padding: "1.25rem",
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "0.75rem",
  };
  const labelCardStyle = {
    display: "grid",
    gap: "0.45rem",
    padding: "0.95rem",
    borderRadius: "12px",
    border: "1px solid #1d1f27",
    background: "rgba(12, 13, 17, 0.92)",
    color: "#d7d9e0",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  };
  const helperStyle = { fontSize: "0.85rem", color: "var(--f1-muted)" };

  const loadRaces = () => JSON.parse(localStorage.getItem("races") || "[]");
  const saveRaces = (list) =>
    localStorage.setItem("races", JSON.stringify(list));

  // Fahrer laden (inkl. Teams aus Verwaltung)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDriverOptions(getStoredDrivers());
  }, []);

  // Bei neuem Rennen alle Fahrer vorselektieren
  useEffect(() => {
    if (!isEdit && driverOptions.length > 0 && drivers.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrivers(driverOptions.map((driver) => driver.name));
    }
  }, [driverOptions, isEdit, drivers.length]);

  // Bei Edit: vorhandene Daten laden
  useEffect(() => {
    if (!isEdit) return;

    const stored = loadRaces();
    const existing = stored.find((race) => String(race.id) === String(raceId));

    if (!existing) {
      navigate("/admin/races");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrack(existing.track || "");
    setWeather(existing.weather || "");
    setDate(existing.date || "");
    setTyres(existing.tyres || "");
    setStatus(existing.status || "");
    setDrivers(existing.drivers || []);
  }, [isEdit, raceId, navigate]);

  const toggleDriver = (driverName) => {
    setDrivers((prev) => {
      if (prev.includes(driverName)) {
        return prev.filter((d) => d !== driverName);
      }
      if (prev.length >= 20) {
        alert("Maximal 20 Fahrer waehlbar");
        return prev;
      }
      return [...prev, driverName];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = loadRaces();

    if (isEdit) {
      const updated = stored.map((race) =>
        String(race.id) === String(raceId)
          ? { ...race, track, weather, date, tyres, status, drivers }
          : race
      );
      saveRaces(updated);
    } else {
      const newRace = {
        id: Date.now(),
        track,
        weather,
        date,
        tyres,
        status,
        drivers,
      };
      stored.push(newRace);
      saveRaces(stored);
    }

    navigate("/admin/races");
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>
        {isEdit ? "Rennen bearbeiten" : "Neues Rennen erstellen"}
      </h1>
      <p style={{ marginTop: 0, color: "var(--f1-muted)", maxWidth: "640px" }}>
        Kerninfos zuerst eintragen, danach bei Bedarf Fahrer abwaehlen. Alle
        Fahrer sind standardmaessig gesetzt, sodass du nur Abmeldungen
        entfernst.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.65rem",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "28px",
                background: accentColor,
                borderRadius: "8px",
              }}
            />
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              Renndaten
            </div>
          </div>

          <div style={gridStyle}>
            <label style={labelCardStyle}>
              <span style={{ fontWeight: 700, color: "#e7e8ec" }}>
                Strecke waehlen
              </span>
              <span style={helperStyle}>
                Verwendet wird der volle Streckenname in den Listen.
              </span>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                required
              >
                <option value="">Bitte waehlen...</option>
                <option value="Bahrain International Circuit">Bahrain</option>
                <option value="Monza">Monza</option>
                <option value="Silverstone">Silverstone</option>
                <option value="Spa-Francorchamps">Spa</option>
                <option value="Red Bull Ring">Red Bull Ring</option>
              </select>
            </label>

            <label style={labelCardStyle}>
              <span style={{ fontWeight: 700, color: "#e7e8ec" }}>Wetter</span>
              <span style={helperStyle}>
                Wird in den Rennkarten fuer Erwartung und Stimmung genutzt.
              </span>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                required
              >
                <option value="">Bitte waehlen...</option>
                <option value="sunny">Sonne</option>
                <option value="cloudy">Wolken</option>
                <option value="rain">Regen</option>
              </select>
            </label>

            <label style={labelCardStyle}>
              <span style={{ fontWeight: 700, color: "#e7e8ec" }}>Datum</span>
              <span style={helperStyle}>Pflichtfeld fuer Planung.</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <label style={labelCardStyle}>
              <span style={{ fontWeight: 700, color: "#e7e8ec" }}>
                Reifenwahl
              </span>
              <span style={helperStyle}>
                Welche Mischung nominiert ist (Soft/Medium/Hard).
              </span>
              <select
                value={tyres}
                onChange={(e) => setTyres(e.target.value)}
                required
              >
                <option value="">Bitte waehlen...</option>
                <option value="soft">Soft</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label style={labelCardStyle}>
              <span style={{ fontWeight: 700, color: "#e7e8ec" }}>Status</span>
              <span style={helperStyle}>
                Steuert, ob Tippen erlaubt ist oder das Rennen geschlossen ist.
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Bitte waehlen...</option>
                <option value="open">Offen</option>
                <option value="voting">Tippen moeglich</option>
                <option value="closed">Geschlossen</option>
              </select>
            </label>
          </div>
        </div>

        <fieldset
          style={{
            ...cardStyle,
            border: "1px solid #1d1f27",
          }}
        >
          <legend
            style={{
              fontWeight: 700,
              color: accentColor,
              padding: "0 0.4rem",
            }}
          >
            Teilnehmende Fahrer (max 20)
          </legend>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {driverOptions.map((driver) => (
              <label
                key={driver.name}
                style={{ display: "flex", gap: "0.35rem" }}
              >
                <input
                  type="checkbox"
                  checked={drivers.includes(driver.name)}
                  onChange={() => toggleDriver(driver.name)}
                />
                <span>
                  {driver.name} ({driver.team})
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">
            {isEdit ? "Aktualisieren" : "Speichern"}
          </button>
          <button type="button" onClick={() => navigate("/admin/races")}>
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminRaceFormPage;
