// Formularseite zum Erstellen oder Bearbeiten eines Rennens
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStoredDrivers } from "../../data/drivers";
import { TRACK_OPTIONS } from "../../data/tracks";

const DRIVER_LIMIT = 20;

function AdminRaceFormPage() {
  const navigate = useNavigate();
  const { raceId } = useParams();
  const isEdit = Boolean(raceId);

  const [track, setTrack] = useState("");
  const [weather, setWeather] = useState("");
  const [date, setDate] = useState("");
  const [tyres, setTyres] = useState("");
  const [status, setStatus] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const missingTrackOption =
    track &&
    !TRACK_OPTIONS.some((option) => String(option.value) === String(track))
      ? track
      : null;

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
      if (prev.length >= DRIVER_LIMIT) {
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
    <div className="race-form-page">
      <header className="race-form-hero">
        <div>
          <p className="admin-eyebrow">
            {isEdit ? "Rennen bearbeiten" : "Neues Rennen"}
          </p>
          <h1>
            {isEdit ? "Renndaten aktualisieren" : "Neues Rennen erstellen"}
          </h1>
          <p className="admin-sub">
            Kerninfos eintragen, Fahrerfeld bei Bedarf ausdünnen. Standardmäßig
            sind alle Fahrer ausgewählt, du entfernst nur Abmeldungen.
          </p>
        </div>
      </header>

      <form className="race-form-shell" onSubmit={handleSubmit}>
        <section className="race-form-section">
          <div className="race-form-section-header">
            <span className="race-form-bar" />
            <div>
              <p className="admin-eyebrow">Renndaten</p>
              <h2>Grunddaten</h2>
            </div>
          </div>

          <div className="race-form-grid">
            <label className="race-field-card">
              <span className="race-field-label">Strecke wählen</span>
              <span className="race-field-help">
                Verwendet wird der volle Streckenname in allen Listen.
              </span>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                required
              >
                <option value="">Bitte wählen...</option>
                {TRACK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                {missingTrackOption && (
                  <option value={missingTrackOption}>{missingTrackOption}</option>
                )}
              </select>
            </label>

            <label className="race-field-card">
              <span className="race-field-label">Wetter</span>
              <span className="race-field-help">
                Für Erwartung und Stimmung in den Rennkarten.
              </span>
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

            <label className="race-field-card">
              <span className="race-field-label">Datum</span>
              <span className="race-field-help">
                Pflichtfeld für Planung und Anzeige.
              </span>
              <div className="race-date-wrapper">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="race-field-card">
              <span className="race-field-label">Reifenwahl</span>
              <span className="race-field-help">
                Welche Mischung nominiert ist (Soft/Medium/Hard).
              </span>
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

            <label className="race-field-card">
              <span className="race-field-label">Status</span>
              <span className="race-field-help">
                Steuert, ob Tippen erlaubt ist oder das Rennen geschlossen ist.
              </span>
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
          </div>
        </section>

        <section className="race-form-section">
          <div className="race-form-section-header">
            <span className="race-form-bar" />
            <div>
              <p className="admin-eyebrow">Fahrerfeld</p>
              <h2>Teilnehmende Fahrer</h2>
            </div>
            <div className="race-form-legend-row">
              <div className="race-driver-legend" aria-hidden="true">
                <div className="race-driver-legend-item">
                  <span className="race-driver-legend-chip is-selected" />
                  <span>Ausgewählt</span>
                </div>
                <div className="race-driver-legend-item">
                  <span className="race-driver-legend-chip" />
                  <span>Nicht ausgewählt</span>
                </div>
              </div>
            </div>
            <div className="race-form-counter">
              {drivers.length}/{DRIVER_LIMIT}
            </div>
          </div>

          <div className="race-driver-grid">
            {driverOptions.map((driver) => (
              <label key={driver.name} className="race-driver-card">
                <div className="race-driver-checkbox">
                  <input
                    type="checkbox"
                    checked={drivers.includes(driver.name)}
                    onChange={() => toggleDriver(driver.name)}
                  />
                  <span className="race-driver-mark" />
                </div>
                <div className="race-driver-info">
                  <span className="race-driver-name">{driver.name}</span>
                  <span className="race-driver-team">{driver.team}</span>
                </div>
              </label>
            ))}
          </div>
        </section>

        <div className="race-form-actions">
          <button type="submit">
            {isEdit ? "Aktualisieren" : "Speichern"}
          </button>
          <button
            type="button"
            className="race-ghost-btn"
            onClick={() => navigate("/admin/races")}
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminRaceFormPage;
