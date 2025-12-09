// Gemeinsame Auth-Seite mit Login links und Registrierung rechts
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";
import { authenticateUser, registerUser } from "../../utils/authStorage";
import { persistPlayerProfile } from "../../utils/profile";

// Initialzustände für Login- und Registrierungsformulare.
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

  // Lokale UI- und Formulare-States
  const [highlight, setHighlight] = useState(
    defaultMode === "register" ? "register" : "login"
  );
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginError, setLoginError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  // Formulareingaben aktualisieren. Separate Handler für Login- und Registrierfelder
  const handleLoginChange = (field) => (event) => {
    const { value } = event.target;
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterChange = (field) => (event) => {
    const { value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  // Startet Nutzersession
  const startSession = (userData, successMessage) => {
    const profile = persistPlayerProfile({
      ...userData,
      lastPasswordChange:
        userData.lastPasswordChange ||
        userData.createdAt ||
        userData.lastUpdated,
    });

    login(profile);
    if (successMessage) {
      setLoginMessage(successMessage);
    }
    navigate(profile.role === "ADMIN" ? "/admin" : "/player");
  };

  // Login-Flow
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setLoginError("");
    setLoginMessage("");

    const { user, error } = authenticateUser(
      loginForm.identifier.trim(),
      loginForm.password
    );

    if (error) {
      setLoginError(error);
      return;
    }

    startSession(user, "Willkommen zurück.");
    setLoginForm(initialLogin);
  };

  // Registrierungs-Flow
  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    setRegisterError("");
    setRegisterMessage("");
    setLoginError("");

    const { user, error } = registerUser({
      email: registerForm.email,
      username: registerForm.username,
      displayName: registerForm.displayName,
      password: registerForm.password,
    });

    if (error) {
      setRegisterError(error);
      return;
    }

    startSession(user, "Account erstellt und eingeloggt.");
    setRegisterMessage("Account erstellt. Du bist jetzt angemeldet.");
    setRegisterForm(initialRegister);
    setHighlight("login");
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

          <button type="submit">Einloggen</button>
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

          <button type="submit">Account erstellen</button>
          <p className="auth-hint">
            Mail, Benutzername und Anzeigename dürfen nur einmal vorkommen.
          </p>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
