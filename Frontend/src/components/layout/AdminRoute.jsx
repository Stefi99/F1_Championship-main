import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";

// Geschützte Route nur für Admin-Benutzer
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  // Nicht eingeloggt = Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Eingeloggt aber keine Admin-Rolle = Weiterleitung zu Player
  if (!isAdmin) {
    return <Navigate to="/player" replace />;
  }

  return children;
}

export default AdminRoute;
