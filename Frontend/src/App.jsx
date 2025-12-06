import { Routes, Route } from "react-router-dom";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRaceListPage from "./pages/admin/AdminRaceListPage";
import AdminRaceFormPage from "./pages/admin/AdminRaceFormPage";
import AdminDriversListPage from "./pages/admin/AdminDriversListPage";
import AdminOfficialResultsPage from "./pages/admin/AdminOfficialResultsPage";
import AdminRoute from "./components/layout/AdminRoute";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>F1 Championship</h1>
      <p>Frontend gestartet.</p>

      <Routes>
        <Route path="*" element={<PageNotFound />} />

        <Route
          path="/admin/dashboard"
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
          path="/admin/races/new"
          element={
            <AdminRoute>
              <AdminRaceFormPage />
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
      </Routes>
    </div>
  );
}

export default App;
