/**
 * AdminRoute - Geschützte Route-Komponente für Admin-Bereiche
 *
 * Diese Komponente schützt Routen, die nur für Administratoren zugänglich sein sollen.
 * Sie überprüft zwei Bedingungen:
 * 1. Ist der Benutzer authentifiziert? → Wenn nicht, Weiterleitung zu /login
 * 2. Hat der Benutzer Admin-Rechte? → Wenn nicht, Weiterleitung zu /player
 *
 * Nur wenn beide Bedingungen erfüllt sind, werden die Kind-Komponenten gerendert.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Die zu schützenden Komponenten
 * @returns {React.ReactNode} Entweder die geschützten Komponenten oder eine Weiterleitung
 */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";

function AdminRoute({ children }) {
  // Authentifizierungsstatus und Admin-Status aus dem Context holen
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  // Prüfung 1: Benutzer nicht eingeloggt → Weiterleitung zum Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Prüfung 2: Benutzer eingeloggt, aber keine Admin-Rolle → Weiterleitung zu Player-Ansicht
  if (!isAdmin) {
    return <Navigate to="/player" replace />;
  }

  // Beide Bedingungen erfüllt: Rendere die geschützten Komponenten
  return children;
}

export default AdminRoute;
