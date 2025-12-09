import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlayerRaceListPage from "../pages/player/PlayerRaceListPage.jsx";

/*
  Prüft:
  - Seite rendert ohne Fehler
  - Header "Rennen zum Tippen" sichtbar
*/

test("PlayerRaceListPage – rendert Grundstruktur", () => {
  render(
    <MemoryRouter>
      <PlayerRaceListPage />
    </MemoryRouter>
  );

  expect(screen.getByText(/rennen zum tippen/i)).toBeInTheDocument();
});
