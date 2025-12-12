/**
 * ProtectedRoute - Geschützte Route-Komponente für authentifizierte Benutzer
 *
 * Diese Komponente schützt Routen, die nur für eingeloggte Benutzer zugänglich sein sollen.
 * Sie überprüft, ob der Benutzer authentifiziert ist:
 * - Nicht eingeloggt → Weiterleitung zu /login
 * - Eingeloggt → Rendere die geschützten Komponenten
 *
 * Im Gegensatz zu AdminRoute ist diese Komponente für alle authentifizierten
 * Benutzer zugänglich (sowohl Player als auch Admin).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Die zu schützenden Komponenten
 * @returns {React.ReactNode} Entweder die geschützten Komponenten oder eine Weiterleitung
 */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";

function ProtectedRoute({ children }) {
  // Authentifizierungsstatus aus dem Context holen
  const { isAuthenticated } = useContext(AuthContext);

  // Benutzer nicht eingeloggt → Weiterleitung zum Login
  // replace prop sorgt dafür, dass die Login-Seite die aktuelle Route in der History ersetzt
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Benutzer eingeloggt: Rendere die geschützten Komponenten
  return children;
}

export default ProtectedRoute;
