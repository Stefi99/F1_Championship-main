/** Diese Datei kann als Backup oder für Entwicklungstests verwendet werden.
 */
import { Routes, Route } from "react-router-dom";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRaceListPage from "./pages/admin/AdminRaceListPage";
import AdminRaceFormPage from "./pages/admin/AdminRaceFormPage";
import AdminDriversListPage from "./pages/admin/AdminDriversListPage";
import AdminOfficialResultsPage from "./pages/admin/AdminOfficialResultsPage";
import AdminRoute from "./components/layout/AdminRoute";
import PageNotFound from "./pages/PageNotFound";

/**
 * App - Legacy-Router-Komponente
 *
 * Definiert nur Admin-spezifische Routen. Alle Routen sind mit AdminRoute
 * geschützt, um sicherzustellen, dass nur authentifizierte Admins Zugriff haben.
 *
 * @returns {JSX.Element} Router-Struktur mit Admin-Routen
 */
function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>F1 Championship</h1>
      <p>Frontend gestartet.</p>

      {/* Router-Konfiguration: Nur Admin-Routen */}
      <Routes>
        {/* Fallback-Route: Zeigt 404-Seite für alle nicht definierten Pfade */}
        <Route path="*" element={<PageNotFound />} />

        {/* Admin Dashboard: Übersichtsseite für Administratoren */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        {/* Admin Rennen-Liste: Verwaltung aller Rennen */}
        <Route
          path="/admin/races"
          element={
            <AdminRoute>
              <AdminRaceListPage />
            </AdminRoute>
          }
        />

        {/* Admin Rennen-Formular: Erstellen/Bearbeiten von Rennen */}
        <Route
          path="/admin/races/new"
          element={
            <AdminRoute>
              <AdminRaceFormPage />
            </AdminRoute>
          }
        />

        {/* Admin Fahrer-Verwaltung: Verwaltung der Fahrerdaten */}
        <Route
          path="/admin/drivers"
          element={
            <AdminRoute>
              <AdminDriversListPage />
            </AdminRoute>
          }
        />

        {/* Admin Offizielle Ergebnisse: Eingabe der offiziellen Rennergebnisse */}
        <Route
          path="/admin/results"
          element={
            <AdminRoute>
              <AdminOfficialResultsPage />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
