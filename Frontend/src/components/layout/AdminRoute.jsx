// Route wird später für geschützen Admin zugriff verwendet.
// Erlaubt aktuell alles, damit das Projekt nicht Blockiert.

function AdminRoute({ children }) {
  // TODO: AuthContext einbauen und Rolle prüfen (admin/player)
  return children;
}

export default AdminRoute;
