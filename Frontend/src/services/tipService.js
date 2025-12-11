// Tip-Service für Backend-Kommunikation
import api from "../utils/api.js";
import { normalizeTipFromBackend, normalizeTipToBackend, validateTip } from "../utils/tipMapper.js";

/**
 * Lädt den Tipp des aktuellen Users für ein bestimmtes Rennen
 * @param {number|string} raceId - Die Rennen-ID
 * @returns {Promise<Object|null>} TipResponseDTO mit raceId und order (normalisiert für Frontend), oder null wenn kein Tipp vorhanden
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
 * Erstellt oder aktualisiert einen Tipp für den aktuellen User
 * @param {number|string} raceId - Die Rennen-ID
 * @param {Array<string>} order - Array von Fahrernamen in Reihenfolge (Top 10)
 * @returns {Promise<Object>} TipResponseDTO mit dem gespeicherten Tipp (normalisiert für Frontend)
 */
export async function createOrUpdateTip(raceId, order) {
  try {
    // Validiere Tip-Daten
    const validation = validateTip(raceId, order);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Normalisiere für Backend
    const tipRequest = normalizeTipToBackend(raceId, order);

    const response = await api.post("/tips", tipRequest);
    return normalizeTipFromBackend(response);
  } catch (error) {
    console.error(`Fehler beim Speichern des Tipps für Rennen ${raceId}:`, error);
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

