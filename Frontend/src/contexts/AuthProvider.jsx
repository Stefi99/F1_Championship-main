import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";

// Provider-Komponente, die den AuthContext bereitstellt
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Prüft beim Laden der App, ob bereits ein Benutzer gespeichert ist
  // (z. B. lokal im LocalStorage gespeichert)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        // microtask vermeidet Cascading Render Warnung
        queueMicrotask(() => {
          setUser(JSON.parse(storedUser));
        });
      } catch (error) {
        console.error("Fehler beim Laden des Benutzers:", error);
      }
    }
  }, []);

  // Test-Login (Player/Admin)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout-Funktion
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    // Kontext-Wert, kann überall genutzt werden
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, //ture wenn eingeloggt
        isAdmin: user?.role === "ADMIN", // true wenn Rolle Admin
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
