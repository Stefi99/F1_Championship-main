import { useEffect, useState } from "react";
import {
  getStoredDrivers,
  saveDrivers,
  clearDriversCache,
  TEAM_OPTIONS,
  defaultDrivers,
} from "../../data/drivers";

// Seite für die Verwaltung der Fahrer (Admin-Bereich)
function AdminDriversListPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Lädt die Fahrer vom Backend beim ersten Rendern.
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const driversData = await getStoredDrivers();
        console.log("Geladene Fahrer:", driversData.length, driversData);
        setDrivers(driversData);
      } catch (error) {
        console.error("Fehler beim Laden der Fahrer:", error);
        setError("Fahrer konnten nicht geladen werden.");
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  //Ändert das Team eines Fahrers direkt, erst beim Speichern dauerhaft gespeichert
  const handleChangeTeam = (id, team) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, team } : d)));
  };

  //Aktualisiert den Namen eines Fahrers
  const handleChangeName = (id, name) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  };

  // Speichert die Änderungen dauerhaft im Backend
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Speichere alle Fahrer im Backend
      await saveDrivers(drivers);

      // Cache aktualisieren
      clearDriversCache();

      // Fahrer neu laden, um Backend-IDs zu erhalten
      const updatedDrivers = await getStoredDrivers();
      setDrivers(updatedDrivers);

      setMessage("Fahrer erfolgreich gespeichert.");
    } catch (error) {
      console.error("Fehler beim Speichern der Fahrer:", error);
      setError(
        "Fahrer konnten nicht gespeichert werden. Bitte versuche es erneut."
      );
    } finally {
      setSaving(false);
    }
  };

  // Ergänzt fehlende Standard-Fahrer zur Liste
  const handleAddMissing = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Finde fehlende Fahrer (vergliche Namen, case-insensitive)
      const currentNames = new Set(
        drivers.map((d) => d.name.toLowerCase().trim())
      );
      const missingDrivers = defaultDrivers.filter(
        (defaultDriver) =>
          !currentNames.has(defaultDriver.name.toLowerCase().trim())
      );

      if (missingDrivers.length === 0) {
        setMessage("Alle Standard-Fahrer sind bereits vorhanden.");
        setSaving(false);
        return;
      }

      // Füge fehlende Fahrer zur aktuellen Liste hinzu
      const updatedDrivers = [...drivers, ...missingDrivers];

      // Speichere alle Fahrer im Backend
      await saveDrivers(updatedDrivers);

      // Cache aktualisieren
      clearDriversCache();

      // Fahrer neu laden
      const reloadedDrivers = await getStoredDrivers();
      setDrivers(reloadedDrivers);

      setMessage(
        `${missingDrivers.length} fehlende Fahrer wurden hinzugefügt.`
      );
    } catch (error) {
      console.error("Fehler beim Hinzufügen fehlender Fahrer:", error);
      setError("Fehlende Fahrer konnten nicht hinzugefügt werden.");
    } finally {
      setSaving(false);
    }
  };

  // Setzt die Fahrerliste auf die Standard-Fahrer zurück
  const handleReset = async () => {
    if (
      !confirm(
        "Möchtest du wirklich alle Fahrer auf die Standard-Liste zurücksetzen?"
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Standard-Fahrer im Backend speichern
      await saveDrivers(defaultDrivers);

      // Cache aktualisieren
      clearDriversCache();

      // Fahrer neu laden
      const updatedDrivers = await getStoredDrivers();
      setDrivers(updatedDrivers);

      setMessage("Fahrerliste auf Standard zurückgesetzt.");
    } catch (error) {
      console.error("Fehler beim Zurücksetzen der Fahrer:", error);
      setError("Fahrer konnten nicht zurückgesetzt werden.");
    } finally {
      setSaving(false);
    }
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
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? "Wird gespeichert..." : "Speichern"}
            </button>
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={handleAddMissing}
              disabled={saving || loading}
            >
              Fehlende Fahrer hinzufügen
            </button>
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={handleReset}
              disabled={saving || loading}
            >
              Auf Standard zurücksetzen
            </button>
          </div>
          {(message || error) && (
            <div
              className={`admin-alert ${error ? "is-error" : "is-success"}`}
              style={{ marginTop: "1rem" }}
            >
              {error || message}
            </div>
          )}
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

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Fahrer werden geladen...</p>
        </div>
      ) : (
        <section className="drivers-panel">
          <div className="drivers-panel-head">
            <div>
              <p className="admin-eyebrow">Roster bearbeiten</p>
              <h2>Namen & Teams anpassen</h2>
              <p className="driver-panel-copy">
                Saubere Schreibweisen halten Ergebnisse und Teamfarben
                konsistent. Änderungen werden im Backend gespeichert und wirken
                sofort in allen Rennen.
              </p>
            </div>
          </div>

          <div className="driver-grid">
            {drivers.map((driver, index) => (
              <div
                key={driver?.id || `driver-${index}`}
                className="driver-card"
              >
                <label className="driver-field">
                  <span className="driver-field-label">Fahrername</span>
                  <input
                    type="text"
                    value={driver.name}
                    onChange={(e) =>
                      handleChangeName(driver.id, e.target.value)
                    }
                  />
                </label>

                <label className="driver-field">
                  <span className="driver-field-label">Team</span>
                  <span className="driver-field-help">
                    Bestimmt Farbkodierung und Zuordnung in allen Rennen.
                  </span>
                  <select
                    value={driver.team}
                    onChange={(e) =>
                      handleChangeTeam(driver.id, e.target.value)
                    }
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
      )}
    </div>
  );
}

export default AdminDriversListPage;
