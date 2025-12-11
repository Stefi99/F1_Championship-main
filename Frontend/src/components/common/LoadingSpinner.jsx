// Zentrale Loading-Spinner-Komponente
import "./LoadingSpinner.css";

/**
 * Loading-Spinner-Komponente
 * @param {Object} props
 * @param {string} props.size - Größe: "small", "medium", "large" (default: "medium")
 * @param {string} props.message - Optional: Nachricht unter dem Spinner
 * @param {boolean} props.fullScreen - Wenn true, wird der Spinner fullscreen angezeigt
 */
function LoadingSpinner({ size = "medium", message = null, fullScreen = false }) {
  const sizeClass = `spinner-${size}`;
  const containerClass = fullScreen ? "spinner-fullscreen" : "spinner-container";

  return (
    <div className={containerClass}>
      <div className={`spinner ${sizeClass}`} role="status" aria-label="Lädt...">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;

