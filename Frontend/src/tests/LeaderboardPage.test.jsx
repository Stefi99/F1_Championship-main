import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlayerLeaderboardPage from "../pages/player/PlayerLeaderboardPage.jsx";

/*
  Prüft:
  - Seite rendert korrekt die Überschrift "Rangliste"
  - Layout lädt ohne Fehler
*/
test("LeaderboardPage – rendert Hauptüberschrift korrekt", () => {
  render(
    <MemoryRouter>
      <PlayerLeaderboardPage />
    </MemoryRouter>
  );

  // EINDEUTIGER Text
  expect(
    screen.getByRole("heading", {
      name: /saison-ranking & race-insights/i,
    })
  ).toBeInTheDocument();
});
