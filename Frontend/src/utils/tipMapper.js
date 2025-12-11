// Mapping-Funktionen für Tip-Daten zwischen Frontend und Backend

/**
 * Normalisiert ein TipRequestDTO für Backend-Übertragung
 * @param {number|string} raceId - Die Rennen-ID
 * @param {Array<string>} order - Array von Fahrernamen (Top 10)
 * @returns {Object} TipRequestDTO für Backend
 */
export function normalizeTipToBackend(raceId, order) {
  return {
    raceId: Number(raceId),
    order: Array.isArray(order)
      ? order.filter(Boolean).slice(0, 10) // Maximal 10 Fahrer, keine leeren Werte
      : [],
  };
}

/**
 * Normalisiert ein TipResponseDTO vom Backend für Frontend-Verwendung
 * @param {Object} backendTip - TipResponseDTO vom Backend
 * @returns {Object} Normalisiertes Tip-Objekt für Frontend
 */
export function normalizeTipFromBackend(backendTip) {
  if (!backendTip) return null;

  return {
    raceId: backendTip.raceId ? Number(backendTip.raceId) : null,
    order: Array.isArray(backendTip.order)
      ? backendTip.order.filter(Boolean)
      : [],
    // Zusätzliche Felder für Kompatibilität (falls Backend später erweitert wird)
    updatedAt: backendTip.updatedAt || null,
    createdAt: backendTip.createdAt || null,
  };
}

/**
 * Validiert ein Tip-Objekt vor dem Senden an Backend
 * @param {number|string} raceId - Die Rennen-ID
 * @param {Array<string>} order - Array von Fahrernamen
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateTip(raceId, order) {
  if (!raceId) {
    return { valid: false, error: "Rennen-ID fehlt" };
  }

  if (!Array.isArray(order)) {
    return { valid: false, error: "Order muss ein Array sein" };
  }

  if (order.length === 0) {
    return { valid: false, error: "Mindestens ein Fahrer muss ausgewählt sein" };
  }

  if (order.length > 10) {
    return { valid: false, error: "Maximal 10 Fahrer erlaubt" };
  }

  // Prüfe auf leere oder ungültige Werte
  const hasInvalidValues = order.some(
    (driver) => !driver || typeof driver !== "string" || driver.trim() === ""
  );

  if (hasInvalidValues) {
    return { valid: false, error: "Ungültige Fahrernamen gefunden" };
  }

  return { valid: true };
}

