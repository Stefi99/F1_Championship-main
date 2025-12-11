// Mapping-Funktionen für Race-Daten zwischen Frontend und Backend

/**
 * RaceStatus-Mapping: Backend Enum <-> Frontend String
 * Backend: OPEN, TIPPABLE, CLOSED
 * Frontend: "open", "voting", "closed"
 */
export const RACE_STATUS_MAP = {
  // Backend Enum -> Frontend String
  OPEN: "open",
  TIPPABLE: "voting",
  CLOSED: "closed",
  // Frontend String -> Backend Enum
  open: "OPEN",
  voting: "TIPPABLE",
  closed: "CLOSED",
};

/**
 * Konvertiert Backend Race-Status (Enum) zu Frontend-Format (String)
 * @param {string} backendStatus - Backend Status (OPEN, TIPPABLE, CLOSED)
 * @returns {string} Frontend Status ("open", "voting", "closed")
 */
export function mapRaceStatusFromBackend(backendStatus) {
  if (!backendStatus) return "open";
  const upper = String(backendStatus).toUpperCase();
  return RACE_STATUS_MAP[upper] || "open";
}

/**
 * Konvertiert Frontend Race-Status (String) zu Backend-Format (Enum)
 * @param {string} frontendStatus - Frontend Status ("open", "voting", "closed")
 * @returns {string} Backend Status (OPEN, TIPPABLE, CLOSED)
 */
export function mapRaceStatusToBackend(frontendStatus) {
  if (!frontendStatus) return "OPEN";
  const lower = String(frontendStatus).toLowerCase();
  return RACE_STATUS_MAP[lower] || "OPEN";
}

/**
 * Normalisiert ein Race-Objekt vom Backend für Frontend-Verwendung
 * @param {Object} backendRace - Race-Objekt vom Backend
 * @returns {Object} Normalisiertes Race-Objekt für Frontend
 */
export function normalizeRaceFromBackend(backendRace) {
  if (!backendRace) return null;

  return {
    id: backendRace.id,
    name: backendRace.name || backendRace.track || "Unnamed Race",
    track: backendRace.track || backendRace.name || "Unknown Track",
    date: backendRace.date, // Backend sendet LocalDate als String (YYYY-MM-DD)
    weather: backendRace.weather || "sunny",
    status: mapRaceStatusFromBackend(backendRace.status),
    resultsOrder: Array.isArray(backendRace.resultsOrder)
      ? backendRace.resultsOrder
      : [],
    // Zusätzliche Felder für Kompatibilität
    drivers: backendRace.drivers || backendRace.resultsOrder || [],
  };
}

/**
 * Normalisiert ein Race-Objekt für Backend-Übertragung
 * @param {Object} frontendRace - Race-Objekt vom Frontend
 * @returns {Object} Normalisiertes Race-Objekt für Backend
 */
export function normalizeRaceToBackend(frontendRace) {
  if (!frontendRace) return null;

  return {
    id: frontendRace.id ? Number(frontendRace.id) : undefined,
    name: frontendRace.name || frontendRace.track || "Unnamed Race",
    track: frontendRace.track || frontendRace.name || "Unknown Track",
    date: frontendRace.date, // Sollte im Format YYYY-MM-DD sein
    weather: frontendRace.weather || "sunny",
    status: mapRaceStatusToBackend(frontendRace.status),
    // resultsOrder wird separat über PUT /races/{id}/results gesendet
  };
}

/**
 * Normalisiert eine Liste von Rennen vom Backend
 * @param {Array} backendRaces - Array von Race-Objekten vom Backend
 * @returns {Array} Array von normalisierten Race-Objekten
 */
export function normalizeRacesFromBackend(backendRaces) {
  if (!Array.isArray(backendRaces)) return [];
  return backendRaces.map(normalizeRaceFromBackend).filter(Boolean);
}

