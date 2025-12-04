import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";

// Geschützte Route für alle eingeloggten Benutzer (Player + Admin)
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  // Wenn nicht eingeloggt = Weiterleitung zu /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
