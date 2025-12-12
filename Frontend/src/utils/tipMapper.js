/**
 * tipMapper.js - Mapping-Funktionen für Tip-Daten zwischen Frontend und Backend
 *
 * Stellt Funktionen bereit, um Tip-Objekte zwischen Backend-Format (DTO)
 * und Frontend-Format zu konvertieren. Enthält auch Validierungsfunktionen,
 * um sicherzustellen, dass nur gültige Tipps gespeichert werden.
 *
 * Alle Tip-Services sollten diese Mapper-Funktionen verwenden.
 */
/**
 * normalizeTipToBackend - Normalisiert Tip-Daten für Backend-Übertragung
 *
 * Konvertiert Frontend-Tip-Daten ins Backend-Format (TipRequestDTO):
 * - Konvertiert raceId zu Number
 * - Filtert leere Werte heraus
 * - Begrenzt auf maximal 10 Fahrer (nur Top 10 werden gewertet)
 *
 * @param {number|string} raceId - Die Rennen-ID
 * @param {Array<string>} order - Array von Fahrernamen in Reihenfolge (Top 10)
 * @returns {Object} TipRequestDTO für Backend
 *                   { raceId: number, order: Array<string> }
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
 * normalizeTipFromBackend - Normalisiert Tip-Daten vom Backend
 *
 * Konvertiert ein TipResponseDTO vom Backend ins Frontend-Format:
 * - Konvertiert raceId zu Number
 * - Filtert leere Werte aus order-Array
 * - Behält zusätzliche Felder (updatedAt, createdAt) für zukünftige Verwendung
 *
 * @param {Object} backendTip - TipResponseDTO vom Backend
 * @param {number|string} backendTip.raceId - Rennen-ID
 * @param {Array<string>} backendTip.order - Getippte Reihenfolge
 * @param {string} backendTip.updatedAt - Optional: Zeitpunkt der letzten Aktualisierung
 * @param {string} backendTip.createdAt - Optional: Zeitpunkt der Erstellung
 * @returns {Object|null} Normalisiertes Tip-Objekt für Frontend oder null wenn Eingabe null
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
 * validateTip - Validiert ein Tip-Objekt vor dem Senden an Backend
 *
 * Führt Client-seitige Validierung durch, um ungültige Tipps
 * bereits vor dem API-Call abzufangen. Prüft:
 * - raceId muss vorhanden sein
 * - order muss ein Array sein
 * - Mindestens ein Fahrer muss ausgewählt sein
 * - Maximal 10 Fahrer erlaubt
 * - Keine leeren oder ungültigen Fahrernamen
 *
 * @param {number|string} raceId - Die Rennen-ID
 * @param {Array<string>} order - Array von Fahrernamen in Reihenfolge
 * @returns {Object} Validierungsergebnis
 *                   { valid: boolean, error?: string }
 *                   - valid: true wenn Tip gültig ist
 *                   - error: Fehlermeldung wenn Tip ungültig ist
 */
export function validateTip(raceId, order) {
  if (!raceId) {
    return { valid: false, error: "Rennen-ID fehlt" };
  }

  if (!Array.isArray(order)) {
    return { valid: false, error: "Order muss ein Array sein" };
  }

  if (order.length === 0) {
    return {
      valid: false,
      error: "Mindestens ein Fahrer muss ausgewählt sein",
    };
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
