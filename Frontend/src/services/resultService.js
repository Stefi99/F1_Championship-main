/**
 * resultService - Service für Backend-Kommunikation bezüglich offizieller Ergebnisse
 *
 * Stellt Funktionen zur Verfügung, um OfficialResult-Objekte zu verwalten.
 * Diese Objekte werden verwendet, um die Punkte für Spieler zu berechnen,
 * basierend auf dem Vergleich zwischen Tipps und offiziellen Ergebnissen.
 *
 * Hinweis: Die Hauptfunktionalität für Race-Results (resultsOrder) ist in
 * raceService.js. Dieser Service fokussiert sich auf OfficialResult-Objekte.
 */
import api from "../utils/api.js";

/**
 * getResultsForRace - Lädt die offiziellen Ergebnisse für ein Rennen
 *
 * Gibt alle OfficialResult-Objekte für ein bestimmtes Rennen zurück.
 * Jedes Ergebnis enthält: raceId, driverId, finalPosition
 *
 * @param {number|string} raceId - Die ID des Rennens
 * @returns {Promise<Array<Object>>} Liste von OfficialResult-Objekten
 *                                    Gibt leeres Array zurück bei Fehler
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
 * createResultsForRace - Erstellt alle Ergebnisse für ein Rennen
 *
 * Diese Funktion wird verwendet, wenn ein Admin die offiziellen Ergebnisse
 * einträgt. Sie:
 * 1. Löscht alle alten OfficialResult-Objekte für das Rennen
 * 2. Erstellt neue OfficialResult-Objekte basierend auf der Reihenfolge
 *
 * Wichtig: Diese Funktion sollte zusammen mit raceService.updateRaceResults()
 * aufgerufen werden, um sowohl die resultsOrder im Race als auch die
 * OfficialResult-Objekte zu aktualisieren.
 *
 * @param {number|string} raceId - Die ID des Rennens
 * @param {Array<string>} resultsOrder - Array von Fahrernamen in Reihenfolge (Platz 1, 2, 3, ...)
 * @param {Object<string, Object>} driversByName - Map von Fahrernamen zu Fahrer-Objekten
 *                                                Jedes Fahrer-Objekt muss eine 'id' Eigenschaft haben
 * @returns {Promise<Array<Object>>} Array der erstellten OfficialResult-Objekte
 * @throws {Error} Wirft einen Fehler, wenn das Erstellen fehlschlägt
 */
export async function createResultsForRace(
  raceId,
  resultsOrder,
  driversByName
) {
  try {
    // Schritt 1: Alte Ergebnisse löschen (um Duplikate zu vermeiden)
    await deleteResultsForRace(raceId);

    // Schritt 2: Neue Ergebnisse erstellen
    const results = [];
    for (let i = 0; i < resultsOrder.length; i++) {
      const driverName = resultsOrder[i];
      const driver = driversByName[driverName];

      // Validierung: Fahrer muss existieren und eine ID haben
      if (!driver || !driver.id) {
        console.warn(
          `Fahrer ${driverName} nicht gefunden oder hat keine ID, überspringe...`
        );
        continue;
      }

      // Position ist 1-basiert (Platz 1, 2, 3, ...)
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
