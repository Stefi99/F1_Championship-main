/**
 * AuthProvider - Provider-Komponente für Authentifizierung
 *
 * Diese Komponente verwaltet den gesamten Authentifizierungszustand der Anwendung:
 * - User-Daten (Profil, Rolle, etc.)
 * - Login/Logout-Funktionalität
 * - Token-Verwaltung und -Validierung
 * - Automatisches Laden von User-Daten beim App-Start
 * - Event-Handling für 401 Unauthorized Responses
 *
 * Der Provider stellt folgende Werte über den Context bereit:
 * - user: Aktuelles User-Objekt oder null
 * - isAuthenticated: Boolean, ob User eingeloggt ist
 * - isAdmin: Boolean, ob User Admin-Rolle hat
 * - loading: Boolean, ob initiale Token-Validierung läuft
 * - login(token, authResponse): Funktion zum Einloggen
 * - logout(): Funktion zum Ausloggen
 * - refreshUser(): Funktion zum Aktualisieren der User-Daten
 */
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import {
  getToken,
  setToken,
  removeToken,
  hasToken,
  setUserId,
  getUserId,
} from "../utils/tokenStorage.js";
import api from "../utils/api.js";
import { normalizeUserFromBackend } from "../utils/userMapper.js";

function AuthProvider({ children }) {
  // State für aktuellen User (null wenn nicht eingeloggt)
  const [user, setUser] = useState(null);
  // Loading-State für initiale Token-Validierung beim App-Start
  const [loading, setLoading] = useState(true);

  /**
   * Lädt User-Daten vom Backend basierend auf einem gespeicherten Token
   *
   * Diese Funktion wird verwendet, um:
   * - Beim App-Start die User-Daten zu laden (wenn Token vorhanden)
   * - Nach dem Login die vollständigen User-Daten zu laden
   * - Nach Profil-Updates die User-Daten zu aktualisieren
   *
   * @param {number|null} preserveId - Optional: User-ID, die beibehalten werden soll
   *                                   (wichtig, da UserProfileDTO keine ID enthält)
   */
  const loadUserFromToken = async (preserveId = null) => {
    // Kein Token vorhanden → kein User eingeloggt
    if (!hasToken()) {
      setLoading(false);
      return;
    }

    try {
      // User-Profil vom Backend über die /users/me Endpoint laden
      const userProfile = await api.get("/users/me");

      // User-Objekt für Frontend normalisieren (Backend-Format → Frontend-Format)
      const userData = normalizeUserFromBackend(userProfile);

      // ID beibehalten, falls vorhanden (UserProfileDTO enthält keine ID)
      // Priorität: preserveId > gespeicherte ID > aktuelle User-ID
      const idToPreserve =
        preserveId !== null ? preserveId : getUserId() || user?.id || null;

      if (idToPreserve !== null) {
        userData.id = idToPreserve;
        // ID auch im Storage speichern für zukünftige Seitenladevorgänge
        setUserId(idToPreserve);
      }

      // User-State aktualisieren
      setUser(userData);
    } catch (error) {
      // Token ist ungültig oder User nicht gefunden → ausloggen
      console.error("Fehler beim Laden des Benutzers:", error);
      removeToken();
      setUser(null);
    } finally {
      // Loading-State beenden (auch bei Fehler)
      setLoading(false);
    }
  };

  /**
   * Effect: Lädt User-Daten beim initialen App-Start
   *
   * Prüft beim ersten Laden der App, ob bereits ein Token im LocalStorage
   * gespeichert ist. Falls ja, werden die User-Daten automatisch vom Backend geladen.
   */
  useEffect(() => {
    // Beim initialen Laden versuche die ID aus dem Storage zu laden
    loadUserFromToken(null);
  }, []);

  /**
   * Effect: Event-Listener für 401 Unauthorized Responses
   *
   * Wenn das Backend einen 401 Unauthorized Status zurückgibt (z.B. Token abgelaufen),
   * wird ein Custom Event "auth:unauthorized" ausgelöst. Dieser Listener reagiert darauf
   * und loggt den User automatisch aus.
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      removeToken();
    };

    // Event-Listener registrieren
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    // Cleanup: Event-Listener beim Unmount entfernen
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  /**
   * Login-Funktion: Meldet einen Benutzer an
   *
   * Speichert das JWT-Token und lädt die vollständigen User-Daten vom Backend.
   * Optional kann eine AuthResponse übergeben werden, um die User-Daten
   * sofort anzuzeigen (Optimistic UI), während die vollständigen Daten geladen werden.
   *
   * @param {string} token - Das JWT-Token vom Backend
   * @param {object|null} authResponse - Optional: AuthResponseDTO mit id, username, role
   *                                    (für schnelleres Setzen der User-Daten)
   */
  const login = async (token, authResponse = null) => {
    // ID aus authResponse extrahieren (wird später benötigt, da UserProfileDTO keine ID enthält)
    const userId = authResponse?.id || null;

    // Wenn AuthResponse vorhanden, User-Daten teilweise vorladen (Optimistic UI)
    // Dies verbessert die User Experience, da die Daten sofort angezeigt werden
    // Vollständige Daten werden dann vom Backend geladen
    if (authResponse) {
      // Temporäres User-Objekt mit Daten aus AuthResponse
      const tempUser = {
        id: userId,
        username: authResponse.username,
        role: authResponse.role,
        // Andere Felder werden beim Laden vom Backend ergänzt
        displayName: authResponse.username, // Fallback
        email: "",
        favoriteTeam: "Keines",
        country: "",
        bio: "",
        points: 0,
      };
      setUser(tempUser);
    }

    // Token im LocalStorage speichern
    setToken(token);

    // User-ID im LocalStorage speichern (falls vorhanden)
    // Wichtig für zukünftige Seitenladevorgänge
    if (userId) {
      setUserId(userId);
    }

    // Vollständige User-Daten vom Backend laden (ID beibehalten)
    setLoading(true);
    await loadUserFromToken(userId);
  };

  /**
   * Logout-Funktion: Meldet einen Benutzer ab
   *
   * Entfernt alle Authentifizierungsdaten (User-State und Token aus dem Storage).
   */
  const logout = () => {
    setUser(null);
    removeToken();
  };

  /**
   * Aktualisiert die User-Daten vom Backend
   *
   * Wird verwendet, nachdem User-Daten geändert wurden (z.B. nach Profil-Update),
   * um die Anzeige mit den neuesten Daten zu synchronisieren.
   */
  const refreshUser = async () => {
    await loadUserFromToken();
  };

  // Context-Wert: Alle Werte und Funktionen, die über den Context verfügbar gemacht werden
  return (
    <AuthContext.Provider
      value={{
        user, // Aktuelles User-Objekt oder null
        isAuthenticated: !!user, // Boolean: true wenn User eingeloggt ist
        isAdmin: user?.role === "ADMIN", // Boolean: true wenn User Admin-Rolle hat
        loading, // Boolean: true während initiale Token-Validierung läuft
        login, // Funktion zum Einloggen
        logout, // Funktion zum Ausloggen
        refreshUser, // Funktion zum Aktualisieren der User-Daten vom Backend
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
