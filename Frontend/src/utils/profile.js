// Verwaltet das Spielerprofil über Backend-API
import api, { ApiError } from "./api.js";

/**
 * Lädt das Spielerprofil vom Backend
 * @returns {Promise<Object>} UserProfileDTO mit allen Profildaten
 */
export async function loadPlayerProfile() {
  try {
    const userProfile = await api.get("/users/me");

    // UserProfileDTO in Frontend-Format konvertieren
    return {
      id: userProfile.id || null,
      username: userProfile.username || "",
      displayName: userProfile.displayName || "",
      email: userProfile.email || "",
      role: userProfile.role || "PLAYER",
      favoriteTeam: userProfile.favoriteTeam || "Keines",
      country: userProfile.country || "",
      bio: userProfile.bio || "",
      points: userProfile.points || 0,
      // Diese Felder kommen nicht vom Backend, werden für Kompatibilität gesetzt
      lastUpdated: new Date().toISOString(),
      lastPasswordChange: null,
    };
  } catch (error) {
    console.error("Fehler beim Laden des Profils:", error);

    // Fallback bei Fehler
    return {
      username: "",
      displayName: "",
      email: "",
      role: "PLAYER",
      favoriteTeam: "Keines",
      country: "",
      bio: "",
      points: 0,
      lastUpdated: null,
      lastPasswordChange: null,
    };
  }
}

/**
 * Speichert das Spielerprofil im Backend
 * @param {Object} profile - Profil-Daten (nur displayName, favoriteTeam, country, bio werden gespeichert)
 * @returns {Promise<Object>} Aktualisiertes UserProfileDTO
 */
export async function persistPlayerProfile(profile) {
  try {
    // UpdateProfileDTO: nur displayName, favoriteTeam, country, bio
    const updateData = {
      displayName: profile.displayName?.trim() || "",
      favoriteTeam: profile.favoriteTeam?.trim() || "Keines",
      country: profile.country?.trim() || "",
      bio: profile.bio?.trim() || "",
    };

    // API-Call zum Backend
    const updatedProfile = await api.put("/users/me", updateData);

    // UserProfileDTO in Frontend-Format konvertieren
    return {
      id: updatedProfile.id || null,
      username: updatedProfile.username || profile.username || "",
      displayName: updatedProfile.displayName || "",
      email: updatedProfile.email || profile.email || "",
      role: updatedProfile.role || profile.role || "PLAYER",
      favoriteTeam: updatedProfile.favoriteTeam || "Keines",
      country: updatedProfile.country || "",
      bio: updatedProfile.bio || "",
      points: updatedProfile.points || profile.points || 0,
      lastUpdated: new Date().toISOString(),
      lastPasswordChange: profile.lastPasswordChange || null,
    };
  } catch (error) {
    console.error("Fehler beim Speichern des Profils:", error);

    if (error instanceof ApiError) {
      throw error; // ApiError weiterwerfen für Error-Handling in Komponenten
    }

    throw new Error("Profil konnte nicht gespeichert werden");
  }
}
