// Login-Seite für Benutzer (Player und Admin)

import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";

// Dieser Login ist nur für den Start.
// Später integrieren wir den echten Login mit Backend.
function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function loginPlayer() {
    login({ username: "player", role: "PLAYER" });
    navigate("/player"); // Weiterleitung
  }

  function loginAdmin() {
    login({ username: "admin", role: "ADMIN" });
    navigate("/admin"); // Weiterleitung
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>

      <button onClick={loginPlayer} style={{ marginRight: "1rem" }}>
        Als Player einloggen
      </button>

      <button onClick={loginAdmin}>Als Admin einloggen</button>
    </div>
  );
}

export default LoginPage;
