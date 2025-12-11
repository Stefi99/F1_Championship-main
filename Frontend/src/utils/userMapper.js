// Mapping-Funktionen für User-Daten zwischen Frontend und Backend

/**
 * Role-Mapping: Backend Enum <-> Frontend String
 * Backend: PLAYER, ADMIN (als Enum)
 * Frontend: "PLAYER", "ADMIN" (als String)
 */
export const USER_ROLE_MAP = {
  PLAYER: "PLAYER",
  ADMIN: "ADMIN",
  // Fallback für Kleinbuchstaben
  player: "PLAYER",
  admin: "ADMIN",
};

/**
 * Normalisiert ein UserProfileDTO vom Backend für Frontend-Verwendung
 * @param {Object} backendUser - UserProfileDTO vom Backend
 * @returns {Object} Normalisiertes User-Objekt für Frontend
 */
export function normalizeUserFromBackend(backendUser) {
  if (!backendUser) return null;

  return {
    id: backendUser.id || null,
    username: backendUser.username || "",
    displayName: backendUser.displayName || backendUser.username || "",
    email: backendUser.email || "",
    role: normalizeRole(backendUser.role),
    favoriteTeam: backendUser.favoriteTeam || "Keines",
    country: backendUser.country || "",
    bio: backendUser.bio || "",
    points: Number.isNaN(Number(backendUser.points))
      ? 0
      : Number(backendUser.points),
    // Zusätzliche Felder für Kompatibilität (nicht vom Backend)
    lastUpdated: new Date().toISOString(),
    lastPasswordChange: null,
  };
}

/**
 * Normalisiert eine Role für Frontend-Verwendung
 * @param {string} role - Role vom Backend (PLAYER, ADMIN oder player, admin)
 * @returns {string} Normalisierte Role (PLAYER, ADMIN)
 */
export function normalizeRole(role) {
  if (!role) return "PLAYER";
  const upper = String(role).toUpperCase();
  return USER_ROLE_MAP[upper] || "PLAYER";
}

/**
 * Prüft ob ein User ein Admin ist
 * @param {Object} user - User-Objekt
 * @returns {boolean} true wenn User Admin ist
 */
export function isAdmin(user) {
  return normalizeRole(user?.role) === "ADMIN";
}

/**
 * Prüft ob ein User ein Player ist
 * @param {Object} user - User-Objekt
 * @returns {boolean} true wenn User Player ist
 */
export function isPlayer(user) {
  return normalizeRole(user?.role) === "PLAYER";
}

