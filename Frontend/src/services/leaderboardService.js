/**
 * leaderboardService - Service für Backend-Kommunikation bezüglich Rangliste
 *
 * Stellt Funktionen zur Verfügung, um Ranglisten-Daten vom Backend zu laden.
 * Die Rangliste wird vom Backend berechnet und enthält bereits sortierte
 * Spieler mit ihren Punkten und Platzierungen.
 */
import api from "../utils/api.js";

/**
 * getLeaderboard - Lädt die Leaderboard-Daten vom Backend
 *
 * Die Rangliste enthält alle Spieler sortiert nach Punkten (absteigend).
 * Jeder Eintrag enthält: username, displayName, points, rank
 *
 * @returns {Promise<Array<Object>>} Liste von LeaderboardDTOs
 *                                   Jedes Objekt enthält: username, displayName, points, rank
 *                                   Gibt leeres Array zurück bei Fehler
 */
export async function getLeaderboard() {
  try {
    const leaderboard = await api.get("/leaderboard");
    return Array.isArray(leaderboard) ? leaderboard : [];
  } catch (error) {
    console.error("Fehler beim Laden der Leaderboard:", error);
    return [];
  }
}
