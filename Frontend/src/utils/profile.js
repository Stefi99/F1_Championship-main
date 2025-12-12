/**
 * profile.js - Verwaltung des Spielerprofils über Backend-API
 *
 * Stellt Funktionen bereit, um:
 * - Profildaten vom Backend zu laden
 * - Profildaten im Backend zu speichern
 *
 * Alle Funktionen verwenden Mapper-Funktionen, um Daten zwischen
 * Backend-Format (DTO) und Frontend-Format zu konvertieren.
 */
import api, { ApiError } from "./api.js";
import { normalizeUserFromBackend } from "./userMapper.js";

/**
 * loadPlayerProfile - Lädt das Spielerprofil vom Backend
 *
 * Lädt die Profildaten des aktuell eingeloggten Benutzers über
 * die /users/me Endpoint. Die Daten werden automatisch vom
 * Backend-Format ins Frontend-Format normalisiert.
 *
 * Bei Fehlern wird ein Fallback-Objekt mit Standard-Werten zurückgegeben,
 * um sicherzustellen, dass die Anwendung weiterhin funktioniert.
 *
 * @returns {Promise<Object>} UserProfileDTO mit allen Profildaten (normalisiert für Frontend)
 *                            Enthält: username, displayName, email, role, favoriteTeam,
 *                                     country, bio, points, lastUpdated, lastPasswordChange
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
 * persistPlayerProfile - Speichert das Spielerprofil im Backend
 *
 * Aktualisiert die Profildaten des aktuell eingeloggten Benutzers.
 * Hinweis: Nicht alle Felder können geändert werden:
 * - Änderbar: displayName, favoriteTeam, country, bio
 * - Nicht änderbar: username, email, password (müssen über andere Endpoints geändert werden)
 * - Berechnet: points (wird vom Backend automatisch berechnet)
 *
 * Die Daten werden vor dem Senden getrimmt (Leerzeichen entfernt).
 *
 * @param {Object} profile - Profil-Daten
 * @param {string} profile.displayName - Anzeigename
 * @param {string} profile.favoriteTeam - Lieblingsteam
 * @param {string} profile.country - Land
 * @param {string} profile.bio - Kurzbeschreibung
 * @returns {Promise<Object>} Aktualisiertes UserProfileDTO (normalisiert für Frontend)
 * @throws {ApiError} Bei Backend-Fehlern
 * @throws {Error} Bei unerwarteten Fehlern
 */
export async function persistPlayerProfile(profile) {
  try {
    // UpdateProfileDTO: Nur die Felder, die das Backend akzeptiert
    // Alle Werte werden getrimmt, um führende/nachfolgende Leerzeichen zu entfernen
    const updateData = {
      displayName: profile.displayName?.trim() || "",
      favoriteTeam: profile.favoriteTeam?.trim() || "Keines",
      country: profile.country?.trim() || "",
      bio: profile.bio?.trim() || "",
    };

    // API-Call zum Backend (PUT /users/me)
    const updatedProfile = await api.put("/users/me", updateData);

    // UserProfileDTO in Frontend-Format konvertieren
    const normalized = normalizeUserFromBackend(updatedProfile);

    // Behalte lokale Felder, die nicht vom Backend kommen
    // (z.B. lastPasswordChange, das nur im Frontend verwendet wird)
    return {
      ...normalized,
      lastPasswordChange: profile.lastPasswordChange || null,
    };
  } catch (error) {
    console.error("Fehler beim Speichern des Profils:", error);

    // ApiError weiterwerfen für differenziertes Error-Handling in Komponenten
    if (error instanceof ApiError) {
      throw error;
    }

    // Unerwartete Fehler: Generischen Error werfen
    throw new Error("Profil konnte nicht gespeichert werden");
  }
}
