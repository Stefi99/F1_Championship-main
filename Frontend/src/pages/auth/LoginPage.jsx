/**
 * AuthPage - Gemeinsame Authentifizierungsseite mit Login und Registrierung
 *
 * Zeigt beide Formulare (Login und Registrierung) nebeneinander an.
 * Der Benutzer kann zwischen beiden wechseln, wobei das fokussierte Formular
 * visuell hervorgehoben wird.
 *
 * Nach erfolgreichem Login oder Registrierung wird der Benutzer automatisch
 * zu seinem Dashboard weitergeleitet (Admin oder Player, je nach Rolle).
 *
 * @param {string} defaultMode - Standard-Modus: "login" oder "register"
 */
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";
import api, { ApiError } from "../../utils/api.js";

/**
 * Initialzustände für Login- und Registrierungsformulare
 */
const initialLogin = { identifier: "", password: "" };
const initialRegister = {
  email: "",
  username: "",
  displayName: "",
  password: "",
};

// Hauptkomponente für Authentifizierung.
function AuthPage({ defaultMode = "login" }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * UI-State: Welches Formular ist aktuell hervorgehoben (für visuelles Feedback)
   */
  const [highlight, setHighlight] = useState(
    defaultMode === "register" ? "register" : "login"
  );

  /**
   * Formular-States für Login und Registrierung
   */
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);

  /**
   * Fehler- und Erfolgsmeldungen für beide Formulare
   */
  const [loginError, setLoginError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  /**
   * Loading-States für beide Formulare (verhindert mehrfaches Absenden)
   */
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  /**
   * Formular-Update-Handler
   *
   * Separate Handler für Login- und Registrierungsformulare,
   * um die Eingaben in den jeweiligen States zu speichern.
   */

  /**
   * handleLoginChange - Aktualisiert ein Feld im Login-Formular
   *
   * @param {string} field - Name des Feldes (z.B. "identifier", "password")
   * @returns {Function} Event-Handler
   */
  const handleLoginChange = (field) => (event) => {
    const { value } = event.target;
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * handleRegisterChange - Aktualisiert ein Feld im Registrierungs-Formular
   *
   * @param {string} field - Name des Feldes (z.B. "email", "username", etc.)
   * @returns {Function} Event-Handler
   */
  const handleRegisterChange = (field) => (event) => {
    const { value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * handleLoginSubmit - Behandelt das Absenden des Login-Formulars
   *
   * Sendet die Anmeldedaten an das Backend, prüft die Antwort und
   * meldet den Benutzer über den AuthContext an. Bei Erfolg wird
   * der Benutzer zu seinem Dashboard weitergeleitet.
   *
   * @param {Event} event - Form-Submit-Event
   */
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoginMessage("");
    setLoginLoading(true);

    try {
      // API-Call zum Backend mit identifier (Email oder Username) und Passwort
      const response = await api.post("/auth/login", {
        identifier: loginForm.identifier.trim(),
        password: loginForm.password,
      });

      // Prüfe ob Response ein Error enthält (Backend sendet manchmal Error im Response-Body)
      if (response.token && response.token.startsWith("ERROR:")) {
        setLoginError(response.token.replace("ERROR: ", ""));
        setLoginLoading(false);
        return;
      }

      // Validierung: Token muss vorhanden sein
      if (!response.token) {
        setLoginError("Kein Token erhalten. Bitte versuche es erneut.");
        setLoginLoading(false);
        return;
      }

      // Token und AuthResponse an AuthProvider übergeben
      // AuthProvider lädt dann automatisch die vollständigen User-Daten vom Backend
      await login(response.token, {
        id: response.id,
        username: response.username,
        role: response.role,
      });

      setLoginMessage("Willkommen zurück.");
      setLoginForm(initialLogin);

      // Warte kurz, damit User die Erfolgsmeldung sieht
      // Dann Navigation basierend auf Rolle (Admin oder Player)
      setTimeout(() => {
        const role = response.role;
        navigate(role === "ADMIN" ? "/admin" : "/player");
      }, 500);
    } catch (error) {
      // Error-Handling
      if (error instanceof ApiError) {
        // Backend-Fehler
        const errorMessage =
          error.data?.message || error.message || "Login fehlgeschlagen";
        setLoginError(errorMessage);
      } else {
        // Netzwerk-Fehler oder andere Fehler
        setLoginError(
          "Verbindungsfehler. Bitte überprüfe deine Internetverbindung."
        );
      }
    } finally {
      setLoginLoading(false);
    }
  };

  /**
   * handleRegisterSubmit - Behandelt das Absenden des Registrierungs-Formulars
   *
   * Erstellt einen neuen Benutzer-Account im Backend, meldet den Benutzer
   * automatisch an und leitet ihn zu seinem Dashboard weiter.
   *
   * @param {Event} event - Form-Submit-Event
   */
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setRegisterError("");
    setRegisterMessage("");
    setLoginError("");
    setRegisterLoading(true);

    try {
      // API-Call zum Backend
      const response = await api.post("/auth/register", {
        email: registerForm.email.trim(),
        username: registerForm.username.trim(),
        displayName: registerForm.displayName.trim(),
        password: registerForm.password,
      });

      // Prüfe ob Response ein Error enthält
      if (response.token && response.token.startsWith("ERROR:")) {
        setRegisterError(response.token.replace("ERROR: ", ""));
        setRegisterLoading(false);
        return;
      }

      if (!response.token) {
        setRegisterError(
          "Registrierung fehlgeschlagen. Bitte versuche es erneut."
        );
        setRegisterLoading(false);
        return;
      }

      // Token und AuthResponse an AuthProvider übergeben
      // AuthProvider lädt dann automatisch die vollständigen User-Daten
      await login(response.token, {
        id: response.id,
        username: response.username,
        role: response.role,
      });

      setRegisterMessage("Account erstellt. Du bist jetzt angemeldet.");
      setRegisterForm(initialRegister);
      setHighlight("login");

      // Warte kurz, damit User die Erfolgsmeldung sieht
      setTimeout(() => {
        // Navigation basierend auf Rolle
        const role = response.role;
        navigate(role === "ADMIN" ? "/admin" : "/player");
      }, 500);
    } catch (error) {
      // Error-Handling
      if (error instanceof ApiError) {
        // Backend-Fehler
        const errorMessage =
          error.data?.message ||
          error.message ||
          "Registrierung fehlgeschlagen";
        setRegisterError(errorMessage);
      } else {
        // Netzwerk-Fehler oder andere Fehler
        setRegisterError(
          "Verbindungsfehler. Bitte überprüfe deine Internetverbindung."
        );
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  // Darstellung beider Auth-Formulare
  return (
    <div className="auth-page">
      <section className="auth-header">
        <h1>Login &amp; Registrierung</h1>
      </section>

      <div className="auth-grid">
        <form
          className={`auth-card ${highlight === "login" ? "is-focused" : ""}`}
          onSubmit={handleLoginSubmit}
        >
          <div className="auth-card-head">
            <div>
              <p className="auth-eyebrow">Login</p>
              <h2>Zurück ins Fahrerlager</h2>
              <p className="auth-sub">
                Mit E-Mail oder Benutzername anmelden und ins Player-Dashboard
                springen.
              </p>
            </div>
            <span className="auth-chip">Nur Login</span>
          </div>

          <label className="auth-field">
            <span>Mail oder Benutzername</span>
            <input
              type="text"
              value={loginForm.identifier}
              onChange={handleLoginChange("identifier")}
              placeholder="player@example.com oder racingfan"
              required
              onFocus={() => setHighlight("login")}
            />
          </label>

          <label className="auth-field">
            <span>Passwort</span>
            <input
              type="password"
              value={loginForm.password}
              onChange={handleLoginChange("password")}
              placeholder="Passwort"
              required
              onFocus={() => setHighlight("login")}
            />
          </label>

          {loginError && (
            <div className="auth-alert is-error">{loginError}</div>
          )}
          {loginMessage && (
            <div className="auth-alert is-success">{loginMessage}</div>
          )}

          <button type="submit" disabled={loginLoading}>
            {loginLoading ? "Wird eingeloggt..." : "Einloggen"}
          </button>
          <p className="auth-hint">
            Login geht mit Mail oder Benutzername + Passwort.
          </p>
        </form>

        <form
          className={`auth-card ${
            highlight === "register" ? "is-focused" : ""
          }`}
          onSubmit={handleRegisterSubmit}
        >
          <div className="auth-card-head">
            <div>
              <p className="auth-eyebrow">Registrierung</p>
              <h2>Neuen Account anlegen</h2>
              <p className="auth-sub">
                Nur einmal registrieren. Danach immer über das Login-Fenster
                anmelden.
              </p>
            </div>
            <span className="auth-chip accent">Eindeutig</span>
          </div>

          <label className="auth-field">
            <span>E-Mail*</span>
            <input
              type="email"
              value={registerForm.email}
              onChange={handleRegisterChange("email")}
              placeholder="mail@beispiel.ch"
              required
              onFocus={() => setHighlight("register")}
            />
          </label>

          <label className="auth-field">
            <span>Benutzername*</span>
            <input
              type="text"
              value={registerForm.username}
              onChange={handleRegisterChange("username")}
              placeholder="fahrerlager"
              required
              onFocus={() => setHighlight("register")}
            />
          </label>

          <label className="auth-field">
            <span>Anzeigename*</span>
            <input
              type="text"
              value={registerForm.displayName}
              onChange={handleRegisterChange("displayName")}
              placeholder="Speedster Max"
              required
              onFocus={() => setHighlight("register")}
            />
          </label>

          <label className="auth-field">
            <span>Passwort*</span>
            <input
              type="password"
              value={registerForm.password}
              onChange={handleRegisterChange("password")}
              placeholder="Passwort"
              required
              onFocus={() => setHighlight("register")}
            />
          </label>

          {registerError && (
            <div className="auth-alert is-error">{registerError}</div>
          )}
          {registerMessage && (
            <div className="auth-alert is-success">{registerMessage}</div>
          )}

          <button type="submit" disabled={registerLoading}>
            {registerLoading ? "Wird erstellt..." : "Account erstellen"}
          </button>
          <p className="auth-hint">
            Mail, Benutzername und Anzeigename dürfen nur einmal vorkommen.
          </p>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
