/**
 * AdminDashboardPage.test.jsx - Tests für die Admin-Dashboard-Seite
 *
 * Diese Tests prüfen, ob die AdminDashboardPage-Komponente korrekt rendert
 * und wichtige UI-Elemente anzeigt.
 *
 * WICHTIG: AdminDashboardPage verwendet useNavigate() von react-router-dom,
 * daher muss die Komponente in einem Router-Kontext gerendert werden.
 * MemoryRouter wird verwendet, um eine Router-Umgebung zu simulieren,
 * ohne dass tatsächliche Navigation stattfindet.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";

/**
 * Test: AdminDashboardPage – zeigt Admin-Navigation an
 *
 * Prüft, ob die Seite grundlegende Admin-spezifische Inhalte anzeigt.
 * Dies ist ein grundlegender Rendering-Test, der sicherstellt, dass
 * die Komponente ohne Fehler geladen wird und erwartete Texte enthält.
 */
test("AdminDashboardPage – zeigt Admin-Navigation an", () => {
  // Setup: Komponente in MemoryRouter rendern
  // MemoryRouter ist notwendig, da AdminDashboardPage useNavigate() verwendet
  // und React Router einen Router-Kontext benötigt
  render(
    <MemoryRouter>
      <AdminDashboardPage />
    </MemoryRouter>
  );

  // Assertion: Seite sollte "Admin" oder ähnlichen Hinweis enthalten
  // Case-insensitive Regex (/admin/i) erlaubt Varianten wie "Admin", "ADMIN", etc.
  expect(screen.getByText(/admin/i)).toBeInTheDocument();
});
