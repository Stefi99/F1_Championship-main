/**
 * LeaderboardPage.test.jsx - Tests für die Ranglisten-Seite
 *
 * Diese Tests prüfen, ob die PlayerLeaderboardPage-Komponente korrekt rendert
 * und die erwarteten Inhalte anzeigt.
 *
 * WICHTIG: PlayerLeaderboardPage verwendet useNavigate() von react-router-dom
 * und benötigt einen AuthContext, daher muss die Komponente in entsprechenden
 * Kontexten gerendert werden.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlayerLeaderboardPage from "../pages/player/PlayerLeaderboardPage.jsx";

/**
 * Test: LeaderboardPage – rendert Hauptüberschrift korrekt
 *
 * Prüft, ob die Hauptüberschrift der Ranglisten-Seite korrekt gerendert wird.
 * Dies ist ein grundlegender Rendering-Test, der sicherstellt, dass die
 * Komponente ohne Fehler geladen wird.
 *
 * Verwendet getByRole("heading") für semantisch korrekte Suche nach
 * Überschriften-Elementen (h1, h2, etc.).
 */
test("LeaderboardPage – rendert Hauptüberschrift korrekt", () => {
  // Setup: Komponente in MemoryRouter rendern
  // MemoryRouter ist notwendig, da PlayerLeaderboardPage useNavigate() verwendet
  render(
    <MemoryRouter>
      <PlayerLeaderboardPage />
    </MemoryRouter>
  );

  // Assertion: Prüfe, ob die Hauptüberschrift vorhanden ist
  // Case-insensitive Regex erlaubt Varianten der Groß-/Kleinschreibung
  // getByRole("heading") ist semantisch korrekt für Überschriften
  expect(
    screen.getByRole("heading", {
      name: /saison-ranking & race-insights/i,
    })
  ).toBeInTheDocument();
});
