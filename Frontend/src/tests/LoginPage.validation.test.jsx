/**
 * LoginPage.validation.test.jsx - Validierungs-Tests für die Login-Seite
 *
 * Diese Tests prüfen die Client-seitige Validierung des Login-Formulars.
 * Sie stellen sicher, dass ungültige Eingaben abgefangen werden, bevor
 * eine API-Anfrage gestellt wird.
 *
 * WICHTIG: AuthPage verwendet AuthContext, daher muss ein Mock-Provider
 * bereitgestellt werden. MemoryRouter ist für useNavigate() notwendig.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.js";
import AuthPage from "../pages/auth/LoginPage.jsx";

/**
 * Test: LoginPage – Fehler bei leeren Feldern, login() wird nicht aufgerufen
 *
 * Prüft die Client-seitige Validierung: Wenn die Formularfelder leer sind,
 * sollte die login()-Funktion nicht aufgerufen werden, da das Formular
 * durch HTML5-Validierung (required-Attribute) blockiert wird.
 *
 * Dies verhindert unnötige API-Aufrufe und verbessert die User Experience.
 */
test("LoginPage – Fehler bei leeren Feldern, login() wird nicht aufgerufen", () => {
  // Setup: Mock-Funktion für login erstellen
  // vi.fn() erstellt eine überwachbare Mock-Funktion von Vitest
  const loginMock = vi.fn();

  // Setup: Komponente mit notwendigen Kontexten rendern
  // - MemoryRouter: für useNavigate()
  // - AuthContext.Provider: für AuthContext (mit Mock login-Funktion)
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: loginMock }}>
        <AuthPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  // Arrange: Finde den Submit-Button
  const submitButton = screen.getByRole("button", { name: /einloggen/i });

  // Act: Klicke auf den Submit-Button
  // Da die Felder leer sind, sollte das Formular durch HTML5-Validierung blockiert werden
  fireEvent.click(submitButton);

  // Assert: login() sollte NICHT aufgerufen worden sein
  // Dies bestätigt, dass die Client-seitige Validierung funktioniert
  expect(loginMock).not.toHaveBeenCalled();
});
