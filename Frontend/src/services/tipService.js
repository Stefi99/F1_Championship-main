/**
 * tipService - Service für Backend-Kommunikation bezüglich Tipps
 *
 * Stellt alle Funktionen zur Verfügung, um mit Spieler-Tipps zu arbeiten:
 * - Laden von Tipps (für ein Rennen oder alle Tipps eines Users)
 * - Erstellen/Aktualisieren von Tipps
 *
 * Alle Funktionen verwenden Mapper-Funktionen, um Daten zwischen
 * Backend-Format (DTO) und Frontend-Format zu konvertieren.
 * Tipps werden validiert, bevor sie gespeichert werden.
 */
import api from "../utils/api.js";
import {
  normalizeTipFromBackend,
  normalizeTipToBackend,
  validateTip,
} from "../utils/tipMapper.js";

/**
 * getTipForRace - Lädt den Tipp des aktuellen Users für ein bestimmtes Rennen
 *
 * Die Funktion verwendet den aktuell eingeloggten User (aus dem Token).
 * Wenn noch kein Tipp vorhanden ist, gibt sie null zurück (kein Fehler).
 *
 * @param {number|string} raceId - Die Rennen-ID
 * @returns {Promise<Object|null>} TipResponseDTO mit raceId und order (normalisiert für Frontend)
 *                                 Oder null, wenn noch kein Tipp vorhanden ist
 * @throws {Error} Wirft einen Fehler bei anderen Fehlern (nicht 404)
 */
export async function getTipForRace(raceId) {
  try {
    const response = await api.get(`/tips/race/${raceId}`);
    return normalizeTipFromBackend(response);
  } catch (error) {
    // 404 bedeutet, dass noch kein Tipp vorhanden ist
    if (error.status === 404) {
      return null;
    }
    console.error(`Fehler beim Laden des Tipps für Rennen ${raceId}:`, error);
    throw error;
  }
}

/**
 * createOrUpdateTip - Erstellt oder aktualisiert einen Tipp
 *
 * Diese Funktion erstellt einen neuen Tipp oder aktualisiert einen bestehenden
 * Tipp für den aktuell eingeloggten User. Das Backend entscheidet automatisch,
 * ob es ein Create oder Update ist.
 *
 * Der Tipp wird vor dem Speichern validiert:
 * - Rennen-ID muss vorhanden sein
 * - Order muss ein Array sein
 * - Maximal 10 Fahrer werden gespeichert (Rest wird ignoriert)
 *
 * @param {number|string} raceId - Die Rennen-ID
 * @param {Array<string>} order - Array von Fahrernamen in Reihenfolge (Top 10)
 *                                Nur die ersten 10 werden gespeichert
 * @returns {Promise<Object>} TipResponseDTO mit dem gespeicherten Tipp (normalisiert für Frontend)
 * @throws {Error} Wirft einen Fehler bei Validierungsfehlern oder Backend-Fehlern
 */
export async function createOrUpdateTip(raceId, order) {
  try {
    // Schritt 1: Validiere Tip-Daten (Rennen-ID, Order-Format, etc.)
    const validation = validateTip(raceId, order);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Schritt 2: Normalisiere Frontend-Daten für Backend-Format
    const tipRequest = normalizeTipToBackend(raceId, order);

    // Schritt 3: Speichere Tipp im Backend
    const response = await api.post("/tips", tipRequest);

    // Schritt 4: Normalisiere Backend-Antwort für Frontend
    return normalizeTipFromBackend(response);
  } catch (error) {
    console.error(
      `Fehler beim Speichern des Tipps für Rennen ${raceId}:`,
      error
    );
    throw error;
  }
}

/**
 * Lädt alle Tipps eines Users
 * @param {number|string} userId - Die User-ID
 * @returns {Promise<Array>} Liste von TipResponseDTOs (normalisiert für Frontend)
 */
export async function getAllTipsForUser(userId) {
  try {
    const tips = await api.get(`/tips/user/${userId}`);
    if (!Array.isArray(tips)) return [];

    return tips.map(normalizeTipFromBackend).filter(Boolean);
  } catch (error) {
    console.error(`Fehler beim Laden der Tipps für User ${userId}:`, error);
    return [];
  }
}
