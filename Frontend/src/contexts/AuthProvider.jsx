import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import {
  getToken,
  setToken,
  removeToken,
  hasToken,
} from "../utils/tokenStorage.js";
import api from "../utils/api.js";

// Provider-Komponente, die den AuthContext bereitstellt
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lädt User-Daten vom Backend basierend auf gespeichertem Token
  const loadUserFromToken = async () => {
    if (!hasToken()) {
      setLoading(false);
      return;
    }

    try {
      // User-Profil vom Backend laden
      const userProfile = await api.get("/users/me");

      // User-Objekt für Frontend erstellen
      const userData = {
        id: userProfile.id || null, // ID kommt möglicherweise nicht aus UserProfileDTO
        username: userProfile.username,
        displayName: userProfile.displayName,
        email: userProfile.email,
        role: userProfile.role,
        favoriteTeam: userProfile.favoriteTeam || "Keines",
        country: userProfile.country || "",
        bio: userProfile.bio || "",
        points: userProfile.points || 0,
      };

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
    loadUserFromToken();
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
    // Token speichern
    setToken(token);

    // Wenn AuthResponse vorhanden, User-Daten teilweise vorladen
    // (vollständige Daten werden dann vom Backend geladen)
    if (authResponse) {
      // Temporäres User-Objekt mit Daten aus AuthResponse
      const tempUser = {
        id: authResponse.id || null,
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

    // Vollständige User-Daten vom Backend laden
    setLoading(true);
    await loadUserFromToken();
  };

  // Logout-Funktion: Entfernt Token und User-Daten
  const logout = () => {
    setUser(null);
    removeToken();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
