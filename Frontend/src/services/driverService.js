// Driver-Service für Backend-Kommunikation
import api from "../utils/api.js";

/**
 * Lädt alle Fahrer vom Backend
 * @returns {Promise<Array>} Liste aller Fahrer
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
 * Speichert mehrere Fahrer (Batch-Update)
 * @param {Array<Object>} drivers - Array von Fahrern
 * @returns {Promise<Array>} Array der aktualisierten/erstellten Fahrer
 */
export async function saveDriversBatch(drivers) {
  try {
    const promises = drivers.map(async (driver) => {
      // Wenn ID vorhanden und numerisch, dann Update
      if (driver.id && typeof driver.id === "number") {
        return await updateDriver(driver.id, driver);
      }
      // Ansonsten Create
      return await createDriver(driver);
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Fehler beim Batch-Speichern der Fahrer:", error);
    throw error;
  }
}

