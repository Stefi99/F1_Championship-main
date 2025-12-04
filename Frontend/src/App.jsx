import { Routes, Route } from "react-router-dom";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRaceListPage from "./pages/admin/AdminRaceListPage";
import DriversListPage from "./pages/admin/DriversListPage";
import AdminRaceFormPage from "./pages/admin/AdminRaceFormPage";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>F1 Championship</h1>
      <p>Frontend gestartet.</p>

      <Routes>
        <Route path="*" element={<PageNotFound />} />

        <Route
          path="/admin/races/new"
          element={
            <AdminRoute>
              <AdminRaceFormPage />
            </AdminRoute>
          }
        />

        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/races" element={<AdminRaceListPage />} />
        <Route path="/admin/drivers" element={<DriversListPage />} />
      </Routes>
    </div>
  );
}

export default App;
