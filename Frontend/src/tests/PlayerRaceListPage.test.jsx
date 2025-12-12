/**
 * PlayerRaceListPage.test.jsx - Tests für die Rennen-Liste-Seite
 *
 * Diese Tests prüfen, ob die PlayerRaceListPage-Komponente korrekt rendert
 * und die erwarteten Inhalte anzeigt.
 *
 * WICHTIG: PlayerRaceListPage verwendet useNavigate() von react-router-dom
 * und benötigt einen AuthContext (optional, da Rennen-Liste auch öffentlich
 * zugänglich ist), daher muss die Komponente in entsprechenden Kontexten
 * gerendert werden.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlayerRaceListPage from "../pages/player/PlayerRaceListPage.jsx";

/**
 * Test: PlayerRaceListPage – rendert Grundstruktur
 *
 * Prüft, ob die Seite grundlegende Inhalte korrekt rendert.
 * Dies ist ein grundlegender Rendering-Test, der sicherstellt, dass die
 * Komponente ohne Fehler geladen wird und die Hauptüberschrift anzeigt.
 *
 * Die Rennen-Liste ist öffentlich zugänglich, daher wird kein AuthContext
 * benötigt. Die Seite sollte auch ohne eingeloggten Benutzer funktionieren.
 */
test("PlayerRaceListPage – rendert Grundstruktur", () => {
  // Setup: Komponente in MemoryRouter rendern
  // MemoryRouter ist notwendig, da PlayerRaceListPage useNavigate() verwendet
  // AuthContext ist optional, da die Seite auch öffentlich zugänglich ist
  render(
    <MemoryRouter>
      <PlayerRaceListPage />
    </MemoryRouter>
  );

  // Assertion: Prüfe, ob die Hauptüberschrift vorhanden ist
  // Case-insensitive Regex erlaubt Varianten der Groß-/Kleinschreibung
  expect(screen.getByText(/rennen zum tippen/i)).toBeInTheDocument();
});
