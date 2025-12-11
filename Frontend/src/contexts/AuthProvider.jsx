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

// Provider-Komponente, die den AuthContext bereitstellt
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lädt User-Daten vom Backend basierend auf gespeichertem Token
  const loadUserFromToken = async (preserveId = null) => {
    if (!hasToken()) {
      setLoading(false);
      return;
    }

    try {
      // User-Profil vom Backend laden
      const userProfile = await api.get("/users/me");

      // User-Objekt für Frontend normalisieren
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

      setUser(userData);
    } catch (error) {
      // Token ist ungültig oder User nicht gefunden
      console.error("Fehler beim Laden des Benutzers:", error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Prüft beim Laden der App, ob bereits ein Token gespeichert ist
  // und lädt dann die User-Daten vom Backend
  useEffect(() => {
    // Beim initialen Laden versuche die ID aus dem Storage zu laden
    loadUserFromToken(null);
  }, []);

  // Event-Listener für 401 Unauthorized (wenn Token ungültig wird)
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      removeToken();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  // Login-Funktion: Speichert Token und lädt User-Daten
  // @param {string} token - Das JWT-Token vom Backend
  // @param {object} authResponse - Optional: AuthResponseDTO mit id, username, role (für schnelleres Setzen)
  const login = async (token, authResponse = null) => {
    // ID aus authResponse speichern (wird später benötigt, da UserProfileDTO keine ID enthält)
    const userId = authResponse?.id || null;

    // Wenn AuthResponse vorhanden, User-Daten teilweise vorladen
    // (vollständige Daten werden dann vom Backend geladen)
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

    // Token speichern
    setToken(token);

    // User-ID speichern (falls vorhanden)
    if (userId) {
      setUserId(userId);
    }

    // Vollständige User-Daten vom Backend laden (ID beibehalten)
    setLoading(true);
    await loadUserFromToken(userId);
  };

  // Logout-Funktion: Entfernt Token und User-Daten
  const logout = () => {
    setUser(null);
    removeToken();
  };

  // Aktualisiert die User-Daten vom Backend (z.B. nach Profil-Update)
  const refreshUser = async () => {
    await loadUserFromToken();
  };

  return (
    // Kontext-Wert, kann überall genutzt werden
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // true wenn eingeloggt
        isAdmin: user?.role === "ADMIN", // true wenn Rolle Admin
        loading, // Loading-State für initiale Token-Validierung
        login,
        logout,
        refreshUser, // Funktion zum Aktualisieren der User-Daten
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
