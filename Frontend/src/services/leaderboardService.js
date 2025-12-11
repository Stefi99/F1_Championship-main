// Leaderboard-Service für Backend-Kommunikation
import api from "../utils/api.js";

/**
 * Lädt die Leaderboard-Daten vom Backend
 * @returns {Promise<Array>} Liste von LeaderboardDTOs mit username, displayName, points, rank
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

