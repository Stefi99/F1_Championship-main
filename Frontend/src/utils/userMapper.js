/**
 * userMapper.js - Mapping-Funktionen für User-Daten zwischen Frontend und Backend
 *
 * Stellt Funktionen bereit, um User-Objekte zwischen Backend-Format (DTO)
 * und Frontend-Format zu konvertieren. Enthält auch Hilfsfunktionen zur
 * Rollen-Prüfung (Admin, Player).
 *
 * Alle User-bezogenen Services sollten diese Mapper-Funktionen verwenden.
 */
/**
 * USER_ROLE_MAP - Role-Mapping zwischen Backend und Frontend
 *
 * Backend verwendet Enum-Werte (PLAYER, ADMIN), Frontend verwendet Strings.
 * Diese Map stellt sicher, dass Rollen konsistent normalisiert werden,
 * unabhängig von Groß-/Kleinschreibung.
 */
export const USER_ROLE_MAP = {
  PLAYER: "PLAYER",
  ADMIN: "ADMIN",
  // Fallback für Kleinbuchstaben (falls Backend manchmal lowercase sendet)
  player: "PLAYER",
  admin: "ADMIN",
};

/**
 * normalizeUserFromBackend - Normalisiert ein UserProfileDTO vom Backend
 *
 * Konvertiert ein UserProfileDTO vom Backend ins Frontend-Format:
 * - Stellt sicher, dass alle erwarteten Felder vorhanden sind
 * - Setzt Fallback-Werte für optionale Felder
 * - Normalisiert die Rolle (PLAYER, ADMIN)
 * - Konvertiert Punkte zu Number
 * - Fügt zusätzliche Felder hinzu (lastUpdated, lastPasswordChange)
 *
 * Hinweis: Die ID wird möglicherweise nicht vom Backend gesendet (UserProfileDTO
 * enthält keine ID). In diesem Fall sollte die ID aus dem Token-Storage geladen werden.
 *
 * @param {Object} backendUser - UserProfileDTO vom Backend
 * @param {number} backendUser.id - Optional: User-ID
 * @param {string} backendUser.username - Benutzername
 * @param {string} backendUser.displayName - Anzeigename
 * @param {string} backendUser.email - E-Mail-Adresse
 * @param {string} backendUser.role - Rolle (PLAYER, ADMIN)
 * @param {string} backendUser.favoriteTeam - Lieblingsteam
 * @param {string} backendUser.country - Land
 * @param {string} backendUser.bio - Kurzbeschreibung
 * @param {number|string} backendUser.points - Punkte
 * @returns {Object|null} Normalisiertes User-Objekt für Frontend oder null wenn Eingabe null
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
    // Punkte zu Number konvertieren (Backend kann String senden)
    points: Number.isNaN(Number(backendUser.points))
      ? 0
      : Number(backendUser.points),
    // Zusätzliche Felder für Kompatibilität (nicht vom Backend)
    // lastUpdated wird auf aktuellen Zeitpunkt gesetzt
    lastUpdated: new Date().toISOString(),
    // lastPasswordChange wird nicht vom Backend gesendet
    lastPasswordChange: null,
  };
}

/**
 * normalizeRole - Normalisiert eine Role für Frontend-Verwendung
 *
 * Konvertiert eine Role in Großbuchstaben und mappt sie auf einen
 * gültigen Wert (PLAYER oder ADMIN). Fallback ist immer "PLAYER".
 *
 * @param {string} role - Role vom Backend (kann PLAYER, ADMIN, player, admin sein)
 * @returns {string} Normalisierte Role ("PLAYER" oder "ADMIN")
 *                   Fallback: "PLAYER" wenn role ungültig oder leer
 */
export function normalizeRole(role) {
  if (!role) return "PLAYER";
  const upper = String(role).toUpperCase();
  return USER_ROLE_MAP[upper] || "PLAYER";
}

/**
 * isAdmin - Prüft ob ein User ein Admin ist
 *
 * Hilfsfunktion zur Rollen-Prüfung. Normalisiert die Role automatisch,
 * um sicherzustellen, dass die Prüfung unabhängig von Groß-/Kleinschreibung funktioniert.
 *
 * @param {Object} user - User-Objekt
 * @param {string} user.role - Rolle des Users
 * @returns {boolean} true wenn User Admin ist, false sonst
 */
export function isAdmin(user) {
  return normalizeRole(user?.role) === "ADMIN";
}

/**
 * isPlayer - Prüft ob ein User ein Player ist
 *
 * Hilfsfunktion zur Rollen-Prüfung. Normalisiert die Role automatisch,
 * um sicherzustellen, dass die Prüfung unabhängig von Groß-/Kleinschreibung funktioniert.
 *
 * @param {Object} user - User-Objekt
 * @param {string} user.role - Rolle des Users
 * @returns {boolean} true wenn User Player ist, false sonst
 */
export function isPlayer(user) {
  return normalizeRole(user?.role) === "PLAYER";
}
