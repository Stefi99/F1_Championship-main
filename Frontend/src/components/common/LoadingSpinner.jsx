/**
 * LoadingSpinner - Zentrale Ladeanzeige-Komponente
 *
 * Zeigt einen animierten Ladeindikator an, während Daten geladen werden
 * oder asynchrone Operationen ausgeführt werden. Unterstützt verschiedene
 * Größen und kann optional im Vollbildmodus angezeigt werden.
 *
 * @param {Object} props
 * @param {string} props.size - Größe des Spinners: "small", "medium", "large" (Standard: "medium")
 * @param {string} props.message - Optional: Nachricht, die unter dem Spinner angezeigt wird
 * @param {boolean} props.fullScreen - Wenn true, wird der Spinner im Vollbildmodus angezeigt (überlagert den gesamten Bildschirm)
 */
import "./LoadingSpinner.css";

function LoadingSpinner({
  size = "medium",
  message = null,
  fullScreen = false,
}) {
  // CSS-Klasse für die Spinner-Größe generieren
  const sizeClass = `spinner-${size}`;
  // Container-Klasse: fullscreen oder normaler Container
  const containerClass = fullScreen
    ? "spinner-fullscreen"
    : "spinner-container";

  return (
    <div className={containerClass}>
      {/* Spinner mit drei animierten Ringen für den Ladeeffekt */}
      <div
        className={`spinner ${sizeClass}`}
        role="status"
        aria-label="Lädt..."
      >
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {/* Optionale Nachricht unter dem Spinner */}
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
