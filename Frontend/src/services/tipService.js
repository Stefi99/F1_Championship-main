// Tip-Service für Backend-Kommunikation
import api from "../utils/api.js";

/**
 * Lädt den Tipp des aktuellen Users für ein bestimmtes Rennen
 * @param {number|string} raceId - Die Rennen-ID
 * @returns {Promise<Object|null>} TipResponseDTO mit raceId und order, oder null wenn kein Tipp vorhanden
 */
export async function getTipForRace(raceId) {
  try {
    const response = await api.get(`/tips/race/${raceId}`);
    return response;
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
 * @returns {Promise<Object>} TipResponseDTO mit dem gespeicherten Tipp
 */
export async function createOrUpdateTip(raceId, order) {
  try {
    const tipRequest = {
      raceId: Number(raceId),
      order: Array.isArray(order) ? order.filter(Boolean).slice(0, 10) : [],
    };

    const response = await api.post("/tips", tipRequest);
    return response;
  } catch (error) {
    console.error(`Fehler beim Speichern des Tipps für Rennen ${raceId}:`, error);
    throw error;
  }
}

/**
 * Lädt alle Tipps eines Users
 * @param {number|string} userId - Die User-ID
 * @returns {Promise<Array>} Liste von TipResponseDTOs
 */
export async function getAllTipsForUser(userId) {
  try {
    const tips = await api.get(`/tips/user/${userId}`);
    return Array.isArray(tips) ? tips : [];
  } catch (error) {
    console.error(`Fehler beim Laden der Tipps für User ${userId}:`, error);
    return [];
  }
}

