// Formularseite zum Erstellen oder Bearbeiten von Rennen
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStoredDrivers,
  getDriverTeam,
  TEAM_CLASS_MAP,
} from "../../data/drivers";
import { TRACK_OPTIONS } from "../../data/tracks";
import {
  getRaceById,
  createRace,
  updateRace,
} from "../../services/raceService.js";
import { ApiError } from "../../utils/api.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

//Limit und Team-Farbzuordnung
const DRIVER_LIMIT = 20;
const TEAM_COLOR_CLASS = (teamName) =>
  TEAM_CLASS_MAP[teamName] || "team-default";

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
  const [driverError, setDriverError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const missingTrackOption =
    track &&
    !TRACK_OPTIONS.some((option) => String(option.value) === String(track))
      ? track
      : null;

  // Fahrer laden (inkl. Teams aus Verwaltung)
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const drivers = await getStoredDrivers();
        setDriverOptions(drivers);
      } catch (error) {
        console.error("Fehler beim Laden der Fahrer:", error);
        setDriverOptions([]);
      }
    };
    loadDrivers();
  }, []);

  // Bei neuem Rennen alle Fahrer vorselektieren
  useEffect(() => {
    if (!isEdit && driverOptions.length > 0 && drivers.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrivers(driverOptions.map((driver) => driver.name));
    }
  }, [driverOptions, isEdit, drivers.length]);

  // Bei Edit: vorhandene Daten vom Backend laden
  useEffect(() => {
    if (!isEdit) return;

    const loadRaceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const existing = await getRaceById(raceId);
        if (!existing) {
          navigate("/admin/races");
          return;
        }

        setTrack(existing.track || existing.name || "");
        setWeather(existing.weather || "");
        setDate(existing.date || "");
        setTyres(existing.tyres || "");
        setStatus(existing.status || "");
        setDrivers(existing.drivers || existing.resultsOrder || []);
      } catch (err) {
        console.error("Fehler beim Laden des Rennens:", err);
        setError(err);
        navigate("/admin/races");
      } finally {
        setLoading(false);
      }
    };

    loadRaceData();
  }, [isEdit, raceId, navigate]);

  // Fügt einen Fahrer hinzu oder entfernt ihn aus der Fahrer-Liste
  const toggleDriver = (driverName) => {
    setDrivers((prev) => {
      if (prev.includes(driverName)) {
        setDriverError("");
        return prev.filter((d) => d !== driverName);
      }
      if (prev.length >= DRIVER_LIMIT) {
        setDriverError(`Maximal ${DRIVER_LIMIT} Fahrer wählbar.`);
        return prev;
      }
      setDriverError("");
      return [...prev, driverName];
    });
  };

  // Speichert das Rennen (Bearbeitung und Neue Rennen) über API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const raceData = {
        name: track || "Unnamed Race", // Backend erwartet 'name'
        track: track,
        date: date,
        weather: weather || "sunny",
        status: status || "open",
        // drivers wird nicht direkt gespeichert, sondern über resultsOrder
      };

      if (isEdit) {
        await updateRace(raceId, raceData);
      } else {
        await createRace(raceData);
      }

      navigate("/admin/races");
    } catch (err) {
      console.error("Fehler beim Speichern des Rennens:", err);
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new Error("Netzwerkfehler oder Server nicht erreichbar."));
      }
    } finally {
      setSaving(false);
    }
  };

  // Darstellung des vollständigen Renn-Formulars
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
                  <option value={missingTrackOption}>
                    {missingTrackOption}
                  </option>
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

          {driverError && <p className="race-driver-error">{driverError}</p>}

          <div className="race-driver-grid">
            {driverOptions.map((driver) => {
              const isSelected = drivers.includes(driver.name);
              const teamClass = TEAM_COLOR_CLASS(
                getDriverTeam(driver.name) || driver.team
              );

              return (
                <label
                  key={driver.name}
                  className={`race-driver-card ${
                    isSelected ? "is-selected" : "is-deselected"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDriver(driver.name)}
                    className="race-driver-checkbox-input"
                    aria-label={`${driver.name} ${
                      isSelected ? "abwählen" : "hinzufügen"
                    }`}
                  />
                  <span
                    className={`race-driver-stripe ${teamClass}`}
                    aria-hidden="true"
                  />
                  <span className="race-driver-check" aria-hidden="true" />
                  <div className="race-driver-card-body">
                    <span className="race-driver-name">{driver.name}</span>
                    <span className="race-driver-team">{driver.team}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <div className="race-form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Speichern..." : isEdit ? "Aktualisieren" : "Speichern"}
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
