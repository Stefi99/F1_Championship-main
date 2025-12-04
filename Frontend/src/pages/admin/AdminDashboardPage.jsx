// Admin Dashboard – Startseite für Administratoren
import { useNavigate } from "react-router-dom";

function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <p>Admin hat Übersicht über die wichtigsten Informationen.</p>
      <button onClick={() => navigate("/admin/races")}>Rennen verwalten</button>

      <button onClick={() => navigate("/admin/drivers")}>
        Fahrer verwalten
      </button>

      <button onClick={() => navigate("/admin/results")}>
        Ergebnisse eintragen
      </button>
    </div>
  );
}

export default AdminDashboardPage;
