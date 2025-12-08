import AuthPage from "./LoginPage.jsx";

// Weiterleitung auf die kombinierte Auth-Seite mit Fokus auf Registrierung
function RegisterPage() {
  return <AuthPage defaultMode="register" />;
}

export default RegisterPage;
