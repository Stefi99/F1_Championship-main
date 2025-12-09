import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.js";
import AuthPage from "../pages/auth/LoginPage.jsx";

/*
  Prüft:
  - Bei leeren Feldern darf login() NICHT aufgerufen werden
*/

test("LoginPage – Fehler bei leeren Feldern, login() wird nicht aufgerufen", () => {
  const loginMock = vi.fn();

  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: loginMock }}>
        <AuthPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  const submitButton = screen.getByRole("button", { name: /einloggen/i });

  fireEvent.click(submitButton);

  expect(loginMock).not.toHaveBeenCalled();
});
