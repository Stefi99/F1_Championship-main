// Verwaltung aller Tipp-Daten eines Spielers über Backend-API
import {
  getTipForRace,
  createOrUpdateTip,
  getAllTipsForUser,
} from "../services/tipService.js";

// Bereinigt Tipp-Liste
const cleanOrder = (order) =>
  Array.isArray(order) ? order.filter(Boolean).slice(0, 10) : [];

/**
 * Lädt alle Tipps des aktuellen Users vom Backend
 * @param {number|string} userId - Die User-ID (aus AuthContext)
 * @returns {Promise<Object>} Objekt mit raceId als Key und { order, updatedAt } als Value
 */
export async function loadPlayerTips(userId) {
  if (!userId) {
    console.warn("Keine User-ID vorhanden, kann Tipps nicht laden");
    return {};
  }

  try {
    const tips = await getAllTipsForUser(userId);

    // Konvertiere Array von TipResponseDTOs in das erwartete Format
    // Format: { [raceId]: { order: [...], updatedAt: ... } }
    const tipsMap = {};
    tips.forEach((tip) => {
      if (tip.raceId) {
        tipsMap[tip.raceId] = {
          order: cleanOrder(tip.order || []),
          updatedAt: null, // Backend liefert kein updatedAt, könnte später hinzugefügt werden
        };
      }
    });

    return tipsMap;
  } catch (error) {
    console.error("Fehler beim Laden der Tipps:", error);
    return {};
  }
}

/**
 * Speichert alle Tipps (wird für Batch-Operationen verwendet)
 * @param {Object} tipsMap - Objekt mit raceId als Key
 * @param {number|string} userId - Die User-ID (optional, wird nicht verwendet, da jeder Tipp einzeln gespeichert wird)
 * @returns {Promise<void>}
 */
export async function savePlayerTips(tipsMap, userId) {
  if (!tipsMap || typeof tipsMap !== "object") {
    return;
  }

  try {
    // Speichere jeden Tipp einzeln
    const promises = Object.entries(tipsMap).map(([raceId, tipData]) => {
      if (tipData && tipData.order) {
        return createOrUpdateTip(raceId, tipData.order);
      }
      return Promise.resolve();
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Fehler beim Speichern der Tipps:", error);
    throw error;
  }
}

/**
 * Lädt den Tipp für ein bestimmtes Rennen
 * @param {number|string} raceId - Die Rennen-ID
 * @returns {Promise<Object|null>} { order: [...], updatedAt: ... } oder null
 */
export async function getRaceTip(raceId) {
  try {
    const tip = await getTipForRace(raceId);

    if (!tip) {
      return null;
    }

    return {
      order: cleanOrder(tip.order || []),
      updatedAt: tip.updatedAt, // Backend liefert kein updatedAt
    };
  } catch (error) {
    // 404 bedeutet, dass noch kein Tipp vorhanden ist
    if (error.status === 404) {
      return null;
    }
    console.error(`Fehler beim Laden des Tipps für Rennen ${raceId}:`, error);
    return null;
  }
}

/**
 * Speichert einen Tipp für ein Rennen
 * @param {number|string} raceId - Die Rennen-ID
 * @param {Array<string>} order - Array von Fahrernamen in Reihenfolge
 * @returns {Promise<Object>} { order: [...], updatedAt: ... }
 */
export async function persistRaceTip(raceId, order) {
  try {
    const response = await createOrUpdateTip(raceId, order);

    return {
      order: cleanOrder(response.order || []),
      updatedAt: new Date().toISOString(), // Frontend setzt updatedAt selbst
    };
  } catch (error) {
    console.error(
      `Fehler beim Speichern des Tipps für Rennen ${raceId}:`,
      error
    );
    throw error;
  }
}
