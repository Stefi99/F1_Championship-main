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

  const loadRaces = () => JSON.parse(localStorage.getItem("races") || "[]");
  const saveRaces = (list) =>
    localStorage.setItem("races", JSON.stringify(list));

  // Fahrer laden (inkl. Teams aus Verwaltung)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDriverOptions(getStoredDrivers());
  }, []);

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
        alert("Maximal 20 Fahrer wählbar");
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
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h1>{isEdit ? "Rennen bearbeiten" : "Neues Rennen erstellen"}</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* Strecke */}
        <label>
          Strecke auswählen:
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            required
          >
            <option value="">Bitte wählen...</option>
            <option value="Bahrain International Circuit">Bahrain</option>
            <option value="Monza">Monza</option>
            <option value="Silverstone">Silverstone</option>
            <option value="Spa-Francorchamps">Spa</option>
            <option value="Red Bull Ring">Red Bull Ring</option>
          </select>
        </label>

        {/* Wetter */}
        <label>
          Wetter:
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            required
          >
            <option value="">Bitte wählen...</option>
            <option value="sunny">Sonne</option>
            <option value="cloudy">Wolken</option>
            <option value="rain">Regen</option>
          </select>
        </label>

        {/* Datum */}
        <label>
          Datum:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        {/* Reifen */}
        <label>
          Reifenwahl:
          <select
            value={tyres}
            onChange={(e) => setTyres(e.target.value)}
            required
          >
            <option value="">Bitte wählen...</option>
            <option value="soft">Soft</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        {/* Status */}
        <label>
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Bitte wählen...</option>
            <option value="open">Offen</option>
            <option value="voting">Tippen möglich</option>
            <option value="closed">Geschlossen</option>
          </select>
        </label>

        {/* Fahrer Auswahl */}
        <fieldset style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <legend>Teilnehmende Fahrer (max 20)</legend>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
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

        {/* Buttons */}
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
