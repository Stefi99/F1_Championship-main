import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminRaceFormPage from "../pages/admin/AdminRaceFormPage.jsx";

/*
  Prüft:
  - Formular-Struktur gerendert
  - Wichtige Labels sind vorhanden (mindestens 1 Treffer)
*/

test("AdminRaceFormPage – zeigt alle Formularfelder und Buttons an", () => {
  render(
    <MemoryRouter>
      <AdminRaceFormPage />
    </MemoryRouter>
  );

  // Mindestens ein Treffer akzeptieren
  expect(screen.getAllByText(/strecke/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/wetter/i)).toBeInTheDocument();
  expect(screen.getByText(/datum/i)).toBeInTheDocument();
  expect(screen.getByText(/reifen/i)).toBeInTheDocument();
  expect(screen.getByText(/status/i)).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /speichern/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /abbrechen/i })
  ).toBeInTheDocument();
});
