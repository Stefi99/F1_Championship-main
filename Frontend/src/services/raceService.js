// Race-Service für Backend-Kommunikation
import api from "../utils/api.js";
import { normalizeRacesFromBackend, normalizeRaceFromBackend, normalizeRaceToBackend } from "../utils/raceMapper.js";

/**
 * Lädt alle Rennen vom Backend
 * @returns {Promise<Array>} Liste aller Rennen (normalisiert für Frontend)
 */
export async function getAllRaces() {
  try {
    const races = await api.get("/races");
    return normalizeRacesFromBackend(races);
  } catch (error) {
    console.error("Fehler beim Laden der Rennen:", error);
    return [];
  }
}

/**
 * Lädt ein Rennen anhand der ID
 * @param {number|string} id - Die Rennen-ID
 * @returns {Promise<Object|null>} Das Rennen oder null (normalisiert für Frontend)
 */
export async function getRaceById(id) {
  try {
    const race = await api.get(`/races/${id}`);
    return normalizeRaceFromBackend(race);
  } catch (error) {
    console.error(`Fehler beim Laden des Rennens ${id}:`, error);
    return null;
  }
}

/**
 * Erstellt ein neues Rennen
 * @param {Object} raceData - Rennen-Daten (Frontend-Format)
 * @param {string} raceData.name - Name des Rennens (z.B. "Bahrain GP")
 * @param {string} raceData.track - Streckenname
 * @param {string} raceData.date - Datum (ISO-String oder YYYY-MM-DD)
 * @param {string} raceData.weather - Wetter (sunny, cloudy, rain)
 * @param {string} raceData.status - Status ("open", "voting", "closed" oder "OPEN", "TIPPABLE", "CLOSED")
 * @returns {Promise<Object>} Das erstellte Rennen (normalisiert für Frontend)
 */
export async function createRace(raceData) {
  try {
    // Normalisiere Frontend-Daten für Backend
    const backendRace = normalizeRaceToBackend(raceData);

    const race = await api.post("/races", backendRace);
    return normalizeRaceFromBackend(race);
  } catch (error) {
    console.error("Fehler beim Erstellen des Rennens:", error);
    throw error;
  }
}

/**
 * Aktualisiert ein bestehendes Rennen
 * @param {number|string} id - Die Rennen-ID
 * @param {Object} raceData - Aktualisierte Rennen-Daten (Frontend-Format)
 * @returns {Promise<Object>} Das aktualisierte Rennen (normalisiert für Frontend)
 */
export async function updateRace(id, raceData) {
  try {
    // Normalisiere Frontend-Daten für Backend
    const backendRace = normalizeRaceToBackend({ ...raceData, id });

    const race = await api.put(`/races/${id}`, backendRace);
    return normalizeRaceFromBackend(race);
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Rennens ${id}:`, error);
    throw error;
  }
}

/**
 * Löscht ein Rennen
 * @param {number|string} id - Die Rennen-ID
 * @returns {Promise<void>}
 */
export async function deleteRace(id) {
  try {
    await api.delete(`/races/${id}`);
  } catch (error) {
    console.error(`Fehler beim Löschen des Rennens ${id}:`, error);
    throw error;
  }
}

/**
 * Aktualisiert die Ergebnisse eines Rennens
 * @param {number|string} id - Die Rennen-ID
 * @param {Array<string>} resultsOrder - Array von Fahrernamen in Reihenfolge
 * @returns {Promise<Object>} Das aktualisierte Rennen (normalisiert für Frontend)
 */
export async function updateRaceResults(id, resultsOrder) {
  try {
    const raceDTO = {
      resultsOrder: Array.isArray(resultsOrder) ? resultsOrder : [],
    };

    const response = await api.put(`/races/${id}/results`, raceDTO);
    return normalizeRaceFromBackend(response);
  } catch (error) {
    console.error(`Fehler beim Aktualisieren der Ergebnisse für Rennen ${id}:`, error);
    throw error;
  }
}

