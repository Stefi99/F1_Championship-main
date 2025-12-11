// Verwaltet das Spielerprofil über Backend-API
import api, { ApiError } from "./api.js";
import { normalizeUserFromBackend } from "./userMapper.js";

/**
 * Lädt das Spielerprofil vom Backend
 * @returns {Promise<Object>} UserProfileDTO mit allen Profildaten (normalisiert für Frontend)
 */
export async function loadPlayerProfile() {
  try {
    const userProfile = await api.get("/users/me");
    return normalizeUserFromBackend(userProfile);
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
 * @returns {Promise<Object>} Aktualisiertes UserProfileDTO (normalisiert für Frontend)
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
    const normalized = normalizeUserFromBackend(updatedProfile);

    // Behalte lokale Felder, die nicht vom Backend kommen
    return {
      ...normalized,
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
