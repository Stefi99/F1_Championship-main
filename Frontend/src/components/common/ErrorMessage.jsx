// Zentrale Error-Message-Komponente
import { getErrorMessage } from "../../utils/errorHandler.js";
import "./ErrorMessage.css";

/**
 * Error-Message-Komponente
 * @param {Object} props
 * @param {Error|ApiError} props.error - Der Fehler
 * @param {string} props.message - Optional: Eigene Fehlermeldung (überschreibt getErrorMessage)
 * @param {boolean} props.dismissible - Wenn true, kann die Meldung geschlossen werden
 * @param {Function} props.onDismiss - Callback wenn Meldung geschlossen wird
 */
function ErrorMessage({ error, message = null, dismissible = false, onDismiss = null }) {
  const displayMessage = message || (error ? getErrorMessage(error) : "Ein Fehler ist aufgetreten.");

  if (!displayMessage) {
    return null;
  }

  return (
    <div className="error-message" role="alert">
      <div className="error-message-content">
        <span className="error-message-icon" aria-hidden="true">
          ⚠️
        </span>
        <span className="error-message-text">{displayMessage}</span>
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

