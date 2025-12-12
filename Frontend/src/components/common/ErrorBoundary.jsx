// React Error Boundary für unerwartete Fehler
import { Component } from "react";
import ErrorMessage from "./ErrorMessage.jsx";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Initialer State: Kein Fehler vorhanden
    this.state = { hasError: false, error: null };
  }

  /**
   * Statische Lifecycle-Methode, die aufgerufen wird, wenn ein Fehler in einem
   * Child-Komponenten auftritt. Aktualisiert den State, damit die Fallback-UI angezeigt wird.
   *
   * @param {Error} error - Der aufgetretene Fehler
   * @returns {Object} Neuer State mit hasError: true und dem Fehler-Objekt
   */
  static getDerivedStateFromError(error) {
    // State aktualisieren, damit beim nächsten Render die Fallback-UI angezeigt wird
    return { hasError: true, error };
  }

  /**
   * Lifecycle-Methode, die aufgerufen wird, nachdem ein Fehler abgefangen wurde.
   * Ideal für Fehler-Logging oder das Senden von Fehlern an einen Error-Reporting-Service.
   *
   * @param {Error} error - Der aufgetretene Fehler
   * @param {Object} errorInfo - Zusätzliche Fehlerinformationen (z.B. Component Stack)
   */
  componentDidCatch(error, errorInfo) {
    // Fehler in der Konsole loggen (in Produktion könnte dies an einen Error-Reporting-Service gesendet werden)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  /**
   * Setzt den Error-State zurück, damit die Komponente erneut gerendert werden kann.
   * Wird vom "Seite neu laden" Button aufgerufen.
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    // Wenn ein Fehler aufgetreten ist, zeige die Fallback-UI
    if (this.state.hasError) {
      // Wenn eine benutzerdefinierte Fallback-UI übergeben wurde, verwende diese
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Standard Fallback-UI mit Fehlermeldung und Reset-Button
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2 className="error-boundary-title">Etwas ist schiefgelaufen</h2>
            {/* Zeige die detaillierte Fehlermeldung an */}
            <ErrorMessage error={this.state.error} />
            {/* Button zum Zurücksetzen des Error-States */}
            <button
              type="button"
              className="error-boundary-button"
              onClick={this.handleReset}
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }

    // Kein Fehler: Rendere die Kind-Komponenten normal
    return this.props.children;
  }
}

export default ErrorBoundary;
