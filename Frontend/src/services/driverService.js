/**
 * driverService - Service für Backend-Kommunikation bezüglich Fahrer
 *
 * Stellt alle Funktionen zur Verfügung, um mit Fahrer-Daten zu arbeiten:
 * - Laden von Fahrern (alle oder einzelne)
 * - Erstellen, Aktualisieren und Löschen von Fahrern
 * - Batch-Operationen (mehrere Fahrer auf einmal speichern)
 *
 * Alle Funktionen verwenden die zentrale API-Utility (api.js) für
 * HTTP-Requests und Fehlerbehandlung.
 */
import api from "../utils/api.js";

/**
 * getAllDrivers - Lädt alle Fahrer vom Backend
 *
 * @returns {Promise<Array<Object>>} Liste aller Fahrer
 *                                    Gibt leeres Array zurück bei Fehler
 */
export async function getAllDrivers() {
  try {
    const drivers = await api.get("/drivers");
    return Array.isArray(drivers) ? drivers : [];
  } catch (error) {
    console.error("Fehler beim Laden der Fahrer:", error);
    return [];
  }
}

/**
 * Lädt einen Fahrer anhand der ID
 * @param {number|string} id - Die Fahrer-ID
 * @returns {Promise<Object|null>} Der Fahrer oder null
 */
export async function getDriverById(id) {
  try {
    const driver = await api.get(`/drivers/${id}`);
    return driver;
  } catch (error) {
    console.error(`Fehler beim Laden des Fahrers ${id}:`, error);
    return null;
  }
}

/**
 * Erstellt einen neuen Fahrer
 * @param {Object} driverData - Fahrer-Daten
 * @param {string} driverData.name - Name des Fahrers
 * @param {string} driverData.team - Team-Name
 * @returns {Promise<Object>} Der erstellte Fahrer
 */
export async function createDriver(driverData) {
  try {
    const driver = await api.post("/drivers", {
      name: driverData.name?.trim() || "",
      team: driverData.team?.trim() || "",
    });
    return driver;
  } catch (error) {
    console.error("Fehler beim Erstellen des Fahrers:", error);
    throw error;
  }
}

/**
 * Aktualisiert einen bestehenden Fahrer
 * @param {number|string} id - Die Fahrer-ID
 * @param {Object} driverData - Aktualisierte Fahrer-Daten
 * @returns {Promise<Object>} Der aktualisierte Fahrer
 */
export async function updateDriver(id, driverData) {
  try {
    const driver = await api.put(`/drivers/${id}`, {
      id: Number(id),
      name: driverData.name?.trim() || "",
      team: driverData.team?.trim() || "",
    });
    return driver;
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Fahrers ${id}:`, error);
    throw error;
  }
}

/**
 * Löscht einen Fahrer
 * @param {number|string} id - Die Fahrer-ID
 * @returns {Promise<void>}
 */
export async function deleteDriver(id) {
  try {
    await api.delete(`/drivers/${id}`);
  } catch (error) {
    console.error(`Fehler beim Löschen des Fahrers ${id}:`, error);
    throw error;
  }
}

/**
 * saveDriversBatch - Speichert mehrere Fahrer auf einmal (Batch-Update)
 *
 * Entscheidet für jeden Fahrer automatisch, ob ein Update oder Create
 * durchgeführt werden soll:
 * - Update: Wenn Fahrer eine numerische ID hat
 * - Create: Wenn Fahrer keine ID hat
 *
 * Alle Operationen werden parallel ausgeführt (Promise.all) für bessere Performance.
 *
 * @param {Array<Object>} drivers - Array von Fahrern
 * @param {number|undefined} drivers[].id - Optional: Fahrer-ID (für Update)
 * @param {string} drivers[].name - Name des Fahrers
 * @param {string} drivers[].team - Team-Name
 * @returns {Promise<Array<Object>>} Array der aktualisierten/erstellten Fahrer
 * @throws {Error} Wirft einen Fehler, wenn das Speichern fehlschlägt
 */
export async function saveDriversBatch(drivers) {
  try {
    // Für jeden Fahrer entscheiden: Update oder Create
    const promises = drivers.map(async (driver) => {
      // Wenn ID vorhanden und numerisch, dann Update
      if (driver.id && typeof driver.id === "number") {
        return await updateDriver(driver.id, driver);
      }
      // Ansonsten Create (neuer Fahrer)
      return await createDriver(driver);
    });

    // Alle Operationen parallel ausführen
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Fehler beim Batch-Speichern der Fahrer:", error);
    throw error;
  }
}
