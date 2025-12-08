const STORAGE_KEY = "playerTips";

const cleanOrder = (order) =>
  Array.isArray(order) ? order.filter(Boolean).slice(0, 10) : [];

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

export function loadPlayerTips() {
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function savePlayerTips(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error("playerTips save error", err);
  }
}

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
