/**
 * AdminDriversListPage - Seite zur Verwaltung der Fahrer (Admin-Bereich)
 *
 * Ermöglicht Administratoren:
 * - Fahrernamen und Team-Zuordnungen zu bearbeiten
 * - Änderungen im Backend zu speichern
 * - Fehlende Standard-Fahrer hinzuzufügen
 * - Die Fahrerliste auf Standard zurückzusetzen
 *
 * Alle Änderungen wirken sofort in allen Rennen, Ergebnissen und Farbcodierungen.
 */
import { useEffect, useState } from "react";
import {
  getStoredDrivers,
  saveDrivers,
  clearDriversCache,
  TEAM_OPTIONS,
  defaultDrivers,
} from "../../data/drivers";

function AdminDriversListPage() {
  // Liste aller Fahrer (wird beim Laden vom Backend gefüllt)
  const [drivers, setDrivers] = useState([]);
  // Loading-State für initiales Laden der Fahrer
  const [loading, setLoading] = useState(true);
  // Saving-State für Speicher-Operationen
  const [saving, setSaving] = useState(false);
  // Erfolgs- und Fehlermeldungen
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /**
   * Effect: Lädt die Fahrer vom Backend beim ersten Rendern
   */
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

  /**
   * handleChangeTeam - Ändert das Team eines Fahrers
   *
   * Änderungen werden nur im lokalen State gespeichert und erst beim
   * Klick auf "Speichern" dauerhaft im Backend gespeichert.
   *
   * @param {string} id - Eindeutige ID des Fahrers
   * @param {string} team - Neuer Team-Name
   */
  const handleChangeTeam = (id, team) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, team } : d)));
  };

  /**
   * handleChangeName - Aktualisiert den Namen eines Fahrers
   *
   * Änderungen werden nur im lokalen State gespeichert und erst beim
   * Klick auf "Speichern" dauerhaft im Backend gespeichert.
   *
   * @param {string} id - Eindeutige ID des Fahrers
   * @param {string} name - Neuer Name des Fahrers
   */
  const handleChangeName = (id, name) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  };

  /**
   * handleSave - Speichert alle Änderungen dauerhaft im Backend
   *
   * Speichert die aktuelle Fahrerliste im Backend, aktualisiert den Cache
   * und lädt die Fahrer neu, um sicherzustellen, dass alle Backend-IDs
   * korrekt sind.
   */
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Speichere alle Fahrer im Backend
      await saveDrivers(drivers);

      // Cache zurücksetzen, damit beim nächsten Laden die neuesten Daten geladen werden
      clearDriversCache();

      // Fahrer neu laden, um Backend-IDs zu erhalten und Konsistenz sicherzustellen
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

  /**
   * handleAddMissing - Ergänzt fehlende Standard-Fahrer zur Liste
   *
   * Vergleicht die aktuelle Fahrerliste mit der Standard-Liste und fügt
   * alle Fahrer hinzu, die in der Standard-Liste vorhanden sind, aber
   * in der aktuellen Liste fehlen. Speichert die erweiterte Liste im Backend.
   */
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

  /**
   * handleReset - Setzt die Fahrerliste auf die Standard-Fahrer zurück
   *
   * Ersetzt die gesamte Fahrerliste durch die Standard-Liste.
   * Benötigt eine Bestätigung vom Benutzer, da dies alle benutzerdefinierten
   * Änderungen überschreibt.
   */
  const handleReset = async () => {
    // Sicherheitsabfrage vor dem Zurücksetzen
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
      // Standard-Fahrer im Backend speichern (überschreibt alle Änderungen)
      await saveDrivers(defaultDrivers);

      // Cache zurücksetzen
      clearDriversCache();

      // Fahrer neu laden, um die Standard-Liste anzuzeigen
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

  // Berechne Anzahl der verschiedenen Teams (für Statistik-Anzeige)
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
