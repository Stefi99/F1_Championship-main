// Result-Service für Backend-Kommunikation
// Hinweis: Die Hauptfunktionalität für Race-Results ist bereits in raceService.js
// Dieser Service kann für zukünftige Erweiterungen verwendet werden
import api from "../utils/api.js";

/**
 * Lädt die offiziellen Ergebnisse für ein Rennen
 * @param {number|string} raceId - Die ID des Rennens
 * @returns {Promise<Array>} Liste von OfficialResult-Objekten
 */
export async function getResultsForRace(raceId) {
  try {
    const results = await api.get(`/results/race/${raceId}`);
    return Array.isArray(results) ? results : [];
  } catch (error) {
    console.error("Fehler beim Laden der Ergebnisse:", error);
    return [];
  }
}

/**
 * Erstellt ein einzelnes Ergebnis
 * @param {number|string} raceId - Die ID des Rennens
 * @param {number|string} driverId - Die ID des Fahrers
 * @param {number} finalPosition - Die finale Position
 * @returns {Promise<Object>} Das erstellte OfficialResult-Objekt
 */
export async function createResult(raceId, driverId, finalPosition) {
  try {
    // Backend erwartet Request-Parameter (@RequestParam), nicht Body
    // Daher Query-Parameter in der URL verwenden
    const params = new URLSearchParams({
      raceId: String(raceId),
      driverId: String(driverId),
      finalPosition: String(finalPosition),
    });
    // POST ohne Body, nur Query-Parameter
    return await api.post(`/results?${params.toString()}`, null);
  } catch (error) {
    console.error("Fehler beim Erstellen des Ergebnisses:", error);
    throw error;
  }
}

/**
 * Löscht alle Ergebnisse für ein Rennen
 * @param {number|string} raceId - Die ID des Rennens
 * @returns {Promise<void>}
 */
export async function deleteResultsForRace(raceId) {
  try {
    await api.delete(`/results/race/${raceId}`);
  } catch (error) {
    console.error("Fehler beim Löschen der Ergebnisse:", error);
    throw error;
  }
}

/**
 * Erstellt alle Ergebnisse für ein Rennen basierend auf der Reihenfolge
 * @param {number|string} raceId - Die ID des Rennens
 * @param {Array<string>} resultsOrder - Array von Fahrernamen in Reihenfolge
 * @param {Object} driversByName - Map von Fahrernamen zu Fahrer-Objekten mit id
 * @returns {Promise<Array>} Array der erstellten OfficialResult-Objekte
 */
export async function createResultsForRace(
  raceId,
  resultsOrder,
  driversByName
) {
  try {
    // Zuerst alte Ergebnisse löschen
    await deleteResultsForRace(raceId);

    // Dann neue Ergebnisse erstellen
    const results = [];
    for (let i = 0; i < resultsOrder.length; i++) {
      const driverName = resultsOrder[i];
      const driver = driversByName[driverName];

      if (!driver || !driver.id) {
        console.warn(
          `Fahrer ${driverName} nicht gefunden oder hat keine ID, überspringe...`
        );
        continue;
      }

      const position = i + 1;
      const result = await createResult(raceId, driver.id, position);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error("Fehler beim Erstellen der Ergebnisse:", error);
    throw error;
  }
}
