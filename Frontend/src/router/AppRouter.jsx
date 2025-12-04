import { Routes, Route } from "react-router-dom";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";

// Player Pages
import PlayerDashboardPage from "../pages/player/PlayerDashboardPage.jsx";
import PlayerLeaderboardPage from "../pages/player/PlayerLeaderboardPage.jsx";
import PlayerRaceListPage from "../pages/player/PlayerRaceListPage.jsx";
import PlayerRaceTipsPage from "../pages/player/PlayerRaceTipsPage.jsx";

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
      <Route element={<Layout />}>
        {/* Home-Bereich*/}
        <Route path="/" element={<HomePage />} />

        {/* Authentifizierung */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Player-Bereich */}
        <Route
          path="/player"
          element={
            <ProtectedRoute>
              <PlayerDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/player/races"
          element={
            <ProtectedRoute>
              <PlayerRaceListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/player/leaderboard"
          element={
            <ProtectedRoute>
              <PlayerLeaderboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/player/race/:raceId/tips"
          element={
            <ProtectedRoute>
              <PlayerRaceTipsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-Bereich */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/races"
          element={
            <AdminRoute>
              <AdminRaceListPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/drivers"
          element={
            <AdminRoute>
              <AdminDriversListPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/results"
          element={
            <AdminRoute>
              <AdminOfficialResultsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/races/new"
          element={
            <AdminRoute>
              <AdminRaceFormPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/races/:raceId/edit"
          element={
            <AdminRoute>
              <AdminRaceFormPage />
            </AdminRoute>
          }
        />

        {/* Fallback wird angezeigt, wenn Route nicht existiert */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
