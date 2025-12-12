/**
 * tips.js - Verwaltung aller Tipp-Daten eines Spielers über Backend-API
 *
 * Stellt High-Level-Funktionen bereit, um mit Spieler-Tipps zu arbeiten.
 * Diese Funktionen verwenden die Low-Level-Services (tipService.js) und
 * bieten zusätzliche Funktionalität wie:
 * - Datenformat-Konvertierung (Array zu Map)
 * - Bereinigung von Tipp-Listen (Filter, Limit)
 * - Fehlerbehandlung mit Fallbacks
 *
 * Diese Utility-Funktionen werden hauptsächlich von Komponenten verwendet,
 * während Services direkt von anderen Services verwendet werden können.
 */
import {
  getTipForRace,
  createOrUpdateTip,
  getAllTipsForUser,
} from "../services/tipService.js";

/**
 * cleanOrder - Bereinigt eine Tipp-Liste
 *
 * Entfernt leere Werte und begrenzt auf maximal 10 Fahrer.
 * Wird verwendet, um konsistente Datenformate sicherzustellen.
 *
 * @param {Array<string>} order - Array von Fahrernamen
 * @returns {Array<string>} Bereinigtes Array (maximal 10 Fahrer, keine leeren Werte)
 */
const cleanOrder = (order) =>
  Array.isArray(order) ? order.filter(Boolean).slice(0, 10) : [];

/**
 * loadPlayerTips - Lädt alle Tipps eines Users vom Backend
 *
 * Lädt alle gespeicherten Tipps eines Benutzers und konvertiert sie
 * in ein Map-Format für einfachen Zugriff: { [raceId]: { order, updatedAt } }
 *
 * Diese Funktion wird verwendet, um alle Tipps eines Users auf einmal
 * zu laden (z.B. für Dashboard-Übersichten).
 *
 * @param {number|string} userId - Die User-ID (aus AuthContext)
 * @returns {Promise<Object<string, Object>>} Map von Tipps
 *                                            Key: raceId (als String)
 *                                            Value: { order: Array<string>, updatedAt: string|null }
 *                                            Gibt leeres Objekt zurück bei Fehler oder fehlender User-ID
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
 * savePlayerTips - Speichert mehrere Tipps auf einmal (Batch-Operation)
 *
 * Speichert alle Tipps aus einer Map parallel. Jeder Tipp wird einzeln
 * gespeichert, da das Backend keine Batch-API für Tipps bereitstellt.
 *
 * Wird verwendet für:
 * - Import/Export-Funktionalität
 * - Massen-Updates (selten)
 *
 * @param {Object<string, Object>} tipsMap - Map von Tipps
 *                                           Key: raceId (als String)
 *                                           Value: { order: Array<string>, updatedAt?: string }
 * @param {number|string} userId - Die User-ID (optional, wird nicht verwendet,
 *                                 da jeder Tipp einzeln gespeichert wird und der User
 *                                 aus dem Token ermittelt wird)
 * @returns {Promise<void>}
 * @throws {Error} Wenn das Speichern fehlschlägt
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
 * getRaceTip - Lädt den Tipp für ein bestimmtes Rennen
 *
 * Lädt den gespeicherten Tipp des aktuell eingeloggten Users für ein
 * bestimmtes Rennen. Wenn noch kein Tipp vorhanden ist, gibt die Funktion
 * null zurück (kein Fehler).
 *
 * @param {number|string} raceId - Die Rennen-ID
 * @returns {Promise<Object|null>} Tipp-Objekt mit { order: Array<string>, updatedAt: string|null }
 *                                 Oder null, wenn noch kein Tipp vorhanden ist oder ein Fehler auftritt
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
 * persistRaceTip - Speichert einen Tipp für ein Rennen
 *
 * Speichert oder aktualisiert den Tipp des aktuell eingeloggten Users
 * für ein bestimmtes Rennen. Das Backend entscheidet automatisch, ob
 * es ein Create oder Update ist.
 *
 * Die Funktion setzt updatedAt selbst, da das Backend dieses Feld
 * möglicherweise nicht zurückgibt.
 *
 * @param {number|string} raceId - Die Rennen-ID
 * @param {Array<string>} order - Array von Fahrernamen in Reihenfolge (Top 10)
 *                                Nur die ersten 10 werden gespeichert
 * @returns {Promise<Object>} Gespeicherter Tipp mit { order: Array<string>, updatedAt: string }
 * @throws {Error} Wenn das Speichern fehlschlägt
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
