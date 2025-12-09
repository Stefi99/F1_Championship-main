import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";

/*
  TESTZWECK:
  AdminDashboardPage benutzt useNavigate() → benötigt Router.
  Test prüft, ob wichtige UI-Inhalte korrekt rendert.
*/

test("AdminDashboardPage – zeigt Admin-Navigation an", () => {
  // Mit MemoryRouter rendern, damit useNavigate() funktioniert
  render(
    <MemoryRouter>
      <AdminDashboardPage />
    </MemoryRouter>
  );

  // Seite zeigt "Admin" oder ähnlichen Hinweis
  expect(screen.getByText(/admin/i)).toBeInTheDocument();
});
