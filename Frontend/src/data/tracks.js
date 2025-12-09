// Track-Konfigurationen für Anzeige und Auswahl.
// Enthält Designinformationen (Labels, Kürzel, Farbverläufe)
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

const DEFAULT_TRACK_VISUAL = {
  label: "Strecke folgt",
  code: "F1",
  gradient: "linear-gradient(135deg, #1f2230 0%, #0c0d11 55%, #0c0d11 100%)",
  pattern:
    "radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.1), transparent 40%)",
};

// Generierte Dropdown-Auswahlliste für Formulare
export const TRACK_OPTIONS = Object.keys(TRACK_PLACEHOLDERS).map((track) => ({
  value: track,
  label: TRACK_PLACEHOLDERS[track].label || track,
}));

// Liefert Design-Informationen für Anzeige eines Rennens
// oder eine Default-Darstellung, falls die Strecke nicht definiert ist.
export function getTrackVisual(trackName) {
  if (!trackName) return DEFAULT_TRACK_VISUAL;
  return (
    TRACK_PLACEHOLDERS[trackName] || {
      ...DEFAULT_TRACK_VISUAL,
      label: trackName,
      code: "F1",
    }
  );
}
