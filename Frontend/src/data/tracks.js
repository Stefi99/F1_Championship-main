/**
 * TRACK_PLACEHOLDERS - Konfigurationen für Rennstrecken
 *
 * Enthält Designinformationen für jede Rennstrecke:
 * - label: Anzeigename der Strecke
 * - code: Länderkürzel (z.B. "BHR" für Bahrain)
 * - gradient: CSS-Farbverlauf für die visuelle Darstellung
 * - pattern: Zusätzliches CSS-Pattern für visuelle Effekte
 *
 * Diese Daten werden verwendet, um Rennen visuell ansprechend darzustellen
 * und Dropdown-Auswahlfelder zu befüllen.
 */
const TRACK_PLACEHOLDERS = {
  "Bahrain International Circuit": {
    label: "Bahrain",
    code: "BHR",
    gradient: "linear-gradient(135deg, #ff6b4a 0%, #941c12 48%, #0f0f17 100%)",
    pattern:
      "radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.18), transparent 30%)",
  },
  Monza: {
    label: "Monza",
    code: "ITA",
    gradient: "linear-gradient(135deg, #1e7d3f 0%, #0f3d21 40%, #0b0f17 100%)",
    pattern:
      "radial-gradient(circle at 82% 16%, rgba(255, 255, 255, 0.12), transparent 36%)",
  },
  Silverstone: {
    label: "Silverstone",
    code: "GBR",
    gradient: "linear-gradient(135deg, #2f4ea3 0%, #16224c 45%, #0b0f17 100%)",
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1), transparent 34%)",
  },
  "Spa-Francorchamps": {
    label: "Spa-Francorchamps",
    code: "BEL",
    gradient: "linear-gradient(135deg, #f5b300 0%, #c24f00 45%, #0b0f17 100%)",
    pattern:
      "radial-gradient(circle at 28% 26%, rgba(255, 255, 255, 0.12), transparent 30%)",
  },
  "Red Bull Ring": {
    label: "Red Bull Ring",
    code: "AUT",
    gradient: "linear-gradient(135deg, #2f2f82 0%, #1c1c4a 45%, #0b0f17 100%)",
    pattern:
      "radial-gradient(circle at 76% 22%, rgba(255, 255, 255, 0.12), transparent 32%)",
  },
};

/**
 * DEFAULT_TRACK_VISUAL - Standard-Design für unbekannte Strecken
 *
 * Wird verwendet, wenn eine Strecke nicht in TRACK_PLACEHOLDERS definiert ist
 * oder wenn kein Streckenname angegeben wurde. Stellt sicher, dass immer
 * eine gültige visuelle Darstellung vorhanden ist.
 */
const DEFAULT_TRACK_VISUAL = {
  label: "Strecke folgt",
  code: "F1",
  gradient: "linear-gradient(135deg, #1f2230 0%, #0c0d11 55%, #0c0d11 100%)",
  pattern:
    "radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.1), transparent 40%)",
};

/**
 * TRACK_OPTIONS - Generierte Dropdown-Auswahlliste für Formulare
 *
 * Wird für Select/Dropdown-Komponenten verwendet, um alle verfügbaren
 * Rennstrecken zur Auswahl anzubieten. Jede Option enthält:
 * - value: Der vollständige Streckenname (für Backend)
 * - label: Der Anzeigename (für Benutzer)
 */
export const TRACK_OPTIONS = Object.keys(TRACK_PLACEHOLDERS).map((track) => ({
  value: track,
  label: TRACK_PLACEHOLDERS[track].label || track,
}));

/**
 * getTrackVisual - Liefert Design-Informationen für eine Rennstrecke
 *
 * Gibt die visuellen Konfigurationsdaten (Label, Code, Gradient, Pattern)
 * für eine gegebene Strecke zurück. Falls die Strecke nicht in TRACK_PLACEHOLDERS
 * definiert ist, wird eine Standard-Darstellung mit dem Streckennamen zurückgegeben.
 *
 * @param {string|null|undefined} trackName - Name der Rennstrecke
 * @returns {Object} Objekt mit label, code, gradient und pattern
 */
export function getTrackVisual(trackName) {
  // Kein Streckenname angegeben → Standard-Darstellung
  if (!trackName) return DEFAULT_TRACK_VISUAL;

  // Strecke in TRACK_PLACEHOLDERS gefunden → verwende diese Konfiguration
  // Sonst: Standard-Darstellung mit dem Streckennamen als Label
  return (
    TRACK_PLACEHOLDERS[trackName] || {
      ...DEFAULT_TRACK_VISUAL,
      label: trackName,
      code: "F1",
    }
  );
}
