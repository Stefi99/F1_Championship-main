/**
 * ErrorMessage - Zentrale Komponente zur Anzeige von Fehlermeldungen
 *
 * Diese Komponente stellt eine einheitliche Darstellung von Fehlermeldungen
 * in der gesamten Anwendung sicher. Sie kann sowohl mit Error-Objekten als auch
 * mit einfachen String-Nachrichten verwendet werden.
 *
 * @param {Object} props
 * @param {Error|ApiError} props.error - Der Fehler-Objekt (optional)
 * @param {string} props.message - Optional: Eigene Fehlermeldung (überschreibt getErrorMessage)
 * @param {boolean} props.dismissible - Wenn true, kann die Meldung geschlossen werden
 * @param {Function} props.onDismiss - Callback wenn Meldung geschlossen wird
 */
import { getErrorMessage } from "../../utils/errorHandler.js";
import "./ErrorMessage.css";

function ErrorMessage({
  error,
  message = null,
  dismissible = false,
  onDismiss = null,
}) {
  // Bestimme die anzuzeigende Nachricht:
  // 1. Priorität: explizit übergebene message
  // 2. Priorität: aus dem Error-Objekt extrahierte Nachricht
  // 3. Fallback: Standard-Fehlermeldung
  const displayMessage =
    message || (error ? getErrorMessage(error) : "Ein Fehler ist aufgetreten.");

  // Wenn keine Nachricht vorhanden ist, rendere nichts
  if (!displayMessage) {
    return null;
  }

  return (
    <div className="error-message" role="alert">
      <div className="error-message-content">
        {/* Warnsymbol zur visuellen Hervorhebung */}
        <span className="error-message-icon" aria-hidden="true">
          ⚠️
        </span>
        {/* Die eigentliche Fehlermeldung */}
        <span className="error-message-text">{displayMessage}</span>
        {/* Schließen-Button, nur anzeigen wenn dismissible=true und onDismiss vorhanden */}
        {dismissible && onDismiss && (
          <button
            type="button"
            className="error-message-dismiss"
            onClick={onDismiss}
            aria-label="Fehlermeldung schließen"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
