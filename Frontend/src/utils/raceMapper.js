// Mapping-Funktionen für Race-Daten zwischen Frontend und Backend

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
 * Normalisiert eine Liste von Rennen vom Backend
 * @param {Array} backendRaces - Array von Race-Objekten vom Backend
 * @returns {Array} Array von normalisierten Race-Objekten
 */
export function normalizeRacesFromBackend(backendRaces) {
  if (!Array.isArray(backendRaces)) return [];
  return backendRaces.map(normalizeRaceFromBackend).filter(Boolean);
}
