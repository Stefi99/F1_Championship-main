/**
 * raceMapper.js - Mapping-Funktionen für Race-Daten zwischen Frontend und Backend
 *
 * Stellt Funktionen bereit, um Race-Objekte zwischen Backend-Format (DTO)
 * und Frontend-Format zu konvertieren. Dies ist notwendig, da:
 * - Backend und Frontend unterschiedliche Feldnamen verwenden können
 * - Datentypen unterschiedlich sein können (z.B. Status als Enum vs. String)
 * - Fallback-Werte für fehlende Felder benötigt werden
 *
 * Alle Race-Services sollten diese Mapper-Funktionen verwenden.
 */
/**
 * normalizeRaceFromBackend - Normalisiert ein Race-Objekt vom Backend
 *
 * Konvertiert ein RaceDTO vom Backend ins Frontend-Format:
 * - Stellt sicher, dass alle erwarteten Felder vorhanden sind
 * - Setzt Fallback-Werte für optionale Felder
 * - Normalisiert Feldnamen (name/track können vertauscht sein)
 * - Konvertiert resultsOrder und drivers zu Arrays
 *
 * @param {Object} backendRace - RaceDTO vom Backend
 * @param {number} backendRace.id - Rennen-ID
 * @param {string} backendRace.name - Rennenname
 * @param {string} backendRace.track - Streckenname
 * @param {string} backendRace.date - Datum (YYYY-MM-DD)
 * @param {string} backendRace.weather - Wetter (sunny, cloudy, rain)
 * @param {string} backendRace.tyres - Reifen (soft, medium, hard)
 * @param {string} backendRace.status - Status (open, voting, closed)
 * @param {Array<string>} backendRace.resultsOrder - Offizielle Reihenfolge
 * @returns {Object|null} Normalisiertes Race-Objekt für Frontend oder null wenn Eingabe null
 */
export function normalizeRaceFromBackend(backendRace) {
  if (!backendRace) return null;

  return {
    id: backendRace.id,
    name: backendRace.name || backendRace.track || "Unnamed Race",
    track: backendRace.track || backendRace.name || "Unknown Track",
    date: backendRace.date, // Backend sendet LocalDate als String (YYYY-MM-DD)
    weather: backendRace.weather || "sunny",
    tyres: backendRace.tyres || "",
    status: backendRace.status || "open",
    resultsOrder: Array.isArray(backendRace.resultsOrder)
      ? backendRace.resultsOrder
      : [],
    // Zusätzliche Felder für Kompatibilität
    drivers: backendRace.drivers || backendRace.resultsOrder || [],
  };
}

/**
 * normalizeRaceToBackend - Normalisiert ein Race-Objekt für Backend-Übertragung
 *
 * Konvertiert ein Race-Objekt vom Frontend ins Backend-Format (RaceDTO):
 * - Konvertiert ID zu Number (falls vorhanden)
 * - Normalisiert Status zu Kleinbuchstaben
 * - Stellt sicher, dass resultsOrder ein Array ist
 * - Setzt optionale Felder auf null (statt undefined)
 *
 * @param {Object} frontendRace - Race-Objekt vom Frontend
 * @param {number|string} frontendRace.id - Rennen-ID (optional für neue Rennen)
 * @param {string} frontendRace.name - Rennenname
 * @param {string} frontendRace.track - Streckenname
 * @param {string} frontendRace.date - Datum (YYYY-MM-DD)
 * @param {string} frontendRace.weather - Wetter
 * @param {string} frontendRace.tyres - Reifen
 * @param {string} frontendRace.status - Status
 * @param {Array<string>} frontendRace.resultsOrder - Offizielle Reihenfolge
 * @param {Array<string>} frontendRace.drivers - Teilnehmende Fahrer (Fallback für resultsOrder)
 * @returns {Object|null} Normalisiertes RaceDTO für Backend oder null wenn Eingabe null
 */
export function normalizeRaceToBackend(frontendRace) {
  if (!frontendRace) return null;

  return {
    id: frontendRace.id ? Number(frontendRace.id) : undefined,
    name: frontendRace.name || frontendRace.track || "Unnamed Race",
    track: frontendRace.track || frontendRace.name || "Unknown Track",
    date: frontendRace.date, // Sollte im Format YYYY-MM-DD sein
    weather: frontendRace.weather || "sunny",
    tyres: frontendRace.tyres || null,
    status: frontendRace.status?.toLowerCase() ?? "open",
    // resultsOrder kann jetzt direkt mit gesendet werden (wenn vorhanden)
    resultsOrder: Array.isArray(frontendRace.resultsOrder)
      ? frontendRace.resultsOrder
      : Array.isArray(frontendRace.drivers)
      ? frontendRace.drivers
      : null,
  };
}

/**
 * normalizeRacesFromBackend - Normalisiert eine Liste von Rennen vom Backend
 *
 * Wrapper-Funktion, die normalizeRaceFromBackend auf jedes Element
 * eines Arrays anwendet. Filtert null-Werte heraus.
 *
 * @param {Array<Object>} backendRaces - Array von RaceDTOs vom Backend
 * @returns {Array<Object>} Array von normalisierten Race-Objekten für Frontend
 *                          Gibt leeres Array zurück, wenn Eingabe kein Array ist
 */
export function normalizeRacesFromBackend(backendRaces) {
  if (!Array.isArray(backendRaces)) return [];
  return backendRaces.map(normalizeRaceFromBackend).filter(Boolean);
}
