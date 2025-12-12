/**
 * AppRouter - Zentrale Router-Konfiguration der Anwendung
 *
 * Definiert alle Routen der Anwendung und ihre Zugriffsrechte:
 * - Öffentliche Routen: Home, Login, Register, Rennen-Liste
 * - Geschützte Routen (ProtectedRoute): Erfordern Login (Player + Admin)
 * - Admin-Routen (AdminRoute): Erfordern Login + Admin-Rolle
 *
 * Alle Routen (außer Auth) verwenden das Layout-Komponente (Navbar + Footer).
 * Nicht existierende Routen werden auf PageNotFound weitergeleitet.
 */
import { Routes, Route } from "react-router-dom";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";

// Player Pages
import PlayerDashboardPage from "../pages/player/PlayerDashboardPage.jsx";
import PlayerLeaderboardPage from "../pages/player/PlayerLeaderboardPage.jsx";
import PlayerRaceListPage from "../pages/player/PlayerRaceListPage.jsx";
import PlayerRaceTipsPage from "../pages/player/PlayerRaceTipsPage.jsx";
import PlayerProfilePage from "../pages/player/PlayerProfilePage.jsx";

// Admin Pages
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminRaceListPage from "../pages/admin/AdminRaceListPage.jsx";
import AdminDriversListPage from "../pages/admin/AdminDriversListPage.jsx";
import AdminOfficialResultsPage from "../pages/admin/AdminOfficialResultsPage.jsx";
import AdminRaceFormPage from "../pages/admin/AdminRaceFormPage.jsx";

// Home Page
import HomePage from "../pages/HomePage.jsx";

// Layout + Route Protection
import Layout from "../components/layout/layout.jsx";
import AdminRoute from "../components/layout/AdminRoute.jsx";
import ProtectedRoute from "../components/layout/ProtectedRoute.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";

function AppRouter() {
  return (
    <Routes>
      {/* Layout-Wrapper: Alle Routen innerhalb verwenden Navbar + Footer */}
      <Route element={<Layout />}>
        {/* Öffentliche Routen - Keine Authentifizierung erforderlich */}

        {/* Home-Bereich: Öffentliche Startseite */}
        <Route path="/" element={<HomePage />} />

        {/* Authentifizierung: Login und Registrierung */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Player-Bereich: Geschützte Routen (erfordern Login) */}

        {/* Player Dashboard: Übersicht für eingeloggte Spieler */}
        <Route
          path="/player"
          element={
            <ProtectedRoute>
              <PlayerDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Profil bearbeiten: Nur für eingeloggte Spieler */}
        <Route
          path="/player/profile"
          element={
            <ProtectedRoute>
              <PlayerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Rennen-Liste: Öffentlich zugänglich (auch ohne Login) */}
        <Route path="/player/races" element={<PlayerRaceListPage />} />

        {/* Rangliste: Geschützt (zeigt persönliche Statistiken) */}
        <Route
          path="/player/leaderboard"
          element={
            <ProtectedRoute>
              <PlayerLeaderboardPage />
            </ProtectedRoute>
          }
        />

        {/* Tipps abgeben/ansehen: Geschützt (erfordert Login) */}
        <Route
          path="/player/race/:raceId/tips"
          element={
            <ProtectedRoute>
              <PlayerRaceTipsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-Bereich: Nur für Administratoren zugänglich */}

        {/* Admin Dashboard: Übersicht für Administratoren */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        {/* Rennen verwalten: Liste aller Rennen */}
        <Route
          path="/admin/races"
          element={
            <AdminRoute>
              <AdminRaceListPage />
            </AdminRoute>
          }
        />

        {/* Fahrer verwalten: Fahrer- und Teamverwaltung */}
        <Route
          path="/admin/drivers"
          element={
            <AdminRoute>
              <AdminDriversListPage />
            </AdminRoute>
          }
        />

        {/* Offizielle Ergebnisse eintragen: Ergebnisverwaltung */}
        <Route
          path="/admin/results"
          element={
            <AdminRoute>
              <AdminOfficialResultsPage />
            </AdminRoute>
          }
        />

        {/* Neues Rennen erstellen: Formular für neue Rennen */}
        <Route
          path="/admin/races/new"
          element={
            <AdminRoute>
              <AdminRaceFormPage />
            </AdminRoute>
          }
        />

        {/* Rennen bearbeiten: Formular zum Bearbeiten bestehender Rennen */}
        <Route
          path="/admin/races/:raceId/edit"
          element={
            <AdminRoute>
              <AdminRaceFormPage />
            </AdminRoute>
          }
        />

        {/* Fallback-Route: Wird angezeigt, wenn keine Route übereinstimmt */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
