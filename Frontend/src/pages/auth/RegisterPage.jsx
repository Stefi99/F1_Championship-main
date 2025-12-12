/**
 * RegisterPage - Wrapper-Komponente für die Registrierungsseite
 *
 * Diese Komponente ist eine einfache Weiterleitung auf die kombinierte
 * AuthPage mit Fokus auf das Registrierungsformular.
 * Die eigentliche Logik befindet sich in AuthPage (LoginPage.jsx).
 */
import AuthPage from "./LoginPage.jsx";

function RegisterPage() {
  return <AuthPage defaultMode="register" />;
}

export default RegisterPage;
