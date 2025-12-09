// Verwaltung aller Tipp-Daten eines Spielers im LocalStorage
const STORAGE_KEY = "playerTips";

// Bereinigt Tipp-Liste
const cleanOrder = (order) =>
  Array.isArray(order) ? order.filter(Boolean).slice(0, 10) : [];

// Sicheres Parsing des Tipp-Objekts. Keine Crashes bei ungültigem JSON
const safeParse = (value) => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.error("playerTips parse error", err);
    return {};
  }
};

// Lädt komplette Tippstruktur aus localStorage
export function loadPlayerTips() {
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

// Speichert vollständige Tippstruktur wieder in localStorage
export function savePlayerTips(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error("playerTips save error", err);
  }
}

// Liefert Tipp für ein bestimmtes Rennen
export function getRaceTip(raceId) {
  const tips = loadPlayerTips();
  const entry = tips[raceId];

  if (Array.isArray(entry)) {
    return { order: cleanOrder(entry), updatedAt: null };
  }

  if (entry && typeof entry === "object") {
    return {
      order: cleanOrder(entry.order),
      updatedAt: entry.updatedAt || null,
    };
  }

  return null;
}

// Speichert Tipp für ein Rennen
export function persistRaceTip(raceId, order) {
  const tips = loadPlayerTips();
  const entry = {
    order: cleanOrder(order),
    updatedAt: new Date().toISOString(),
  };
  const next = {
    ...tips,
    [raceId]: entry,
  };
  savePlayerTips(next);
  return entry;
}
