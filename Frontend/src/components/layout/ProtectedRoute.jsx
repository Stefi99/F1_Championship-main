// Route-Schutz für alle Bereiche, die nur für eingeloggte Benutzer sichtbar sein sollen.

function ProtectedRoute({ children }) {
  // TODO: Später Login-Status aus dem AuthContext prüfen
  return children;
}

export default ProtectedRoute;
