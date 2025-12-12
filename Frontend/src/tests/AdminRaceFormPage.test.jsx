/**
 * AdminRaceFormPage.test.jsx - Tests für die Rennen-Formular-Seite
 *
 * Diese Tests prüfen, ob die AdminRaceFormPage-Komponente alle notwendigen
 * Formularfelder und Buttons korrekt rendert.
 *
 * WICHTIG: AdminRaceFormPage verwendet useNavigate() und useParams() von
 * react-router-dom, daher muss die Komponente in einem Router-Kontext
 * gerendert werden.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminRaceFormPage from "../pages/admin/AdminRaceFormPage.jsx";

/**
 * Test: AdminRaceFormPage – zeigt alle Formularfelder und Buttons an
 *
 * Prüft, ob alle wichtigen Formularfelder (Strecke, Wetter, Datum, Reifen, Status)
 * und die Haupt-Buttons (Speichern, Abbrechen) korrekt gerendert werden.
 *
 * Hinweis: Für "Strecke" wird getAllByText verwendet, da dieses Label möglicherweise
 * mehrfach vorkommt (z.B. in Label und Help-Text). Mindestens ein Vorkommen
 * reicht aus, um zu bestätigen, dass das Feld vorhanden ist.
 */
test("AdminRaceFormPage – zeigt alle Formularfelder und Buttons an", () => {
  // Setup: Komponente in MemoryRouter rendern
  // MemoryRouter ist notwendig für useNavigate() und useParams()
  render(
    <MemoryRouter>
      <AdminRaceFormPage />
    </MemoryRouter>
  );

  // Assertions: Prüfe, ob alle wichtigen Formularfelder vorhanden sind

  // Strecke: Mindestens ein Vorkommen (kann mehrfach vorkommen)
  expect(screen.getAllByText(/strecke/i).length).toBeGreaterThan(0);

  // Wetter: Muss genau einmal vorhanden sein
  expect(screen.getByText(/wetter/i)).toBeInTheDocument();

  // Datum: Muss genau einmal vorhanden sein
  expect(screen.getByText(/datum/i)).toBeInTheDocument();

  // Reifen: Muss genau einmal vorhanden sein
  expect(screen.getByText(/reifen/i)).toBeInTheDocument();

  // Status: Muss genau einmal vorhanden sein
  expect(screen.getByText(/status/i)).toBeInTheDocument();

  // Assertions: Prüfe, ob die Haupt-Buttons vorhanden sind
  // getByRole mit name-Option ist semantisch korrekt für Buttons
  expect(
    screen.getByRole("button", { name: /speichern/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /abbrechen/i })
  ).toBeInTheDocument();
});
