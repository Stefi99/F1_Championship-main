/**
 * TEAM_CLASS_MAP - Zuordnung von Team-Namen zu CSS-Klassen
 *
 * Diese Map wird verwendet, um jedem F1-Team eine entsprechende CSS-Klasse
 * zuzuordnen, die für die farbliche Darstellung der Teams verwendet wird.
 * Ein Team kann mehrere Namen haben (z.B. "Red Bull" und "Red Bull Racing").
 */
export const TEAM_CLASS_MAP = {
  "Red Bull": "team-red-bull",
  "Red Bull Racing": "team-red-bull",
  Ferrari: "team-ferrari",
  Mercedes: "team-mercedes",
  McLaren: "team-mclaren",
  "Aston Martin": "team-aston-martin",
  Alpine: "team-alpine",
  Sauber: "team-sauber",
  Haas: "team-haas",
  Williams: "team-williams",
  RB: "team-rb",
};

/**
 * TEAM_OPTIONS - Liste aller verfügbaren Team-Namen
 *
 * Wird für Dropdown-Auswahlfelder verwendet, um alle verfügbaren Teams
 * zur Auswahl anzubieten.
 */
export const TEAM_OPTIONS = Object.keys(TEAM_CLASS_MAP);

/**
 * defaultDrivers - Standard-Liste aller F1-Fahrer
 *
 * Diese Liste enthält alle aktuellen F1-Fahrer mit ihren Teams.
 * Sie wird als Fallback verwendet, wenn das Backend keine Fahrer liefert
 * oder wenn ein Fehler beim Laden auftritt.
 *
 * Jeder Fahrer hat:
 * - id: Eindeutige ID (normalerweise kebab-case des Namens)
 * - name: Vollständiger Name des Fahrers
 * - team: Name des Teams, für das der Fahrer fährt
 */
export const defaultDrivers = [
  { id: "max-verstappen", name: "Max Verstappen", team: "Red Bull Racing" },
  { id: "yuki-tsunoda", name: "Yuki Tsunoda", team: "Red Bull Racing" },
  { id: "kimi-antonelli", name: "Kimi Antonelli", team: "Mercedes" },
  { id: "george-russell", name: "George Russell", team: "Mercedes" },
  { id: "charles-leclerc", name: "Charles Leclerc", team: "Ferrari" },
  { id: "lewis-hamilton", name: "Lewis Hamilton", team: "Ferrari" },
  { id: "lando-norris", name: "Lando Norris", team: "McLaren" },
  { id: "oscar-piastri", name: "Oscar Piastri", team: "McLaren" },
  { id: "fernando-alonso", name: "Fernando Alonso", team: "Aston Martin" },
  { id: "lance-stroll", name: "Lance Stroll", team: "Aston Martin" },
  { id: "pierre-gasly", name: "Pierre Gasly", team: "Alpine" },
  { id: "franco-colapinto", name: "Franco Colapinto", team: "Alpine" },
  { id: "liam-lawson", name: "Liam Lawson", team: "RB" },
  { id: "isack-hadjar", name: "Isack Hadjar", team: "RB" },
  { id: "gabriel-bortoleto", name: "Gabriel Bortoleto", team: "Sauber" },
  { id: "nico-hulkenberg", name: "Nico Hülkenberg", team: "Sauber" },
  { id: "esteban-ocon", name: "Esteban Ocon", team: "Haas" },
  { id: "oliver-bearman", name: "Oliver Bearman", team: "Haas" },
  { id: "alexander-albon", name: "Alexander Albon", team: "Williams" },
  { id: "carlos-sainz", name: "Carlos Sainz", team: "Williams" },
];

/**
 * withIds - Stellt sicher, dass alle Fahrer eine eindeutige ID haben
 *
 * Diese Funktion normalisiert eine Liste von Fahrern und stellt sicher,
 * dass jeder Fahrer eine eindeutige ID hat. Falls keine ID vorhanden ist,
 * wird der Name als ID verwendet. Falls die ID bereits verwendet wurde,
 * wird ein Index angehängt, um Eindeutigkeit zu gewährleisten.
 *
 * @param {Array<Object>} driversList - Liste von Fahrern (kann IDs haben oder nicht)
 * @returns {Array<Object>} Liste von Fahrern mit garantiert eindeutigen IDs
 */
function withIds(driversList) {
  // Validierung: Wenn keine Array, leere Liste zurückgeben
  if (!Array.isArray(driversList)) {
    return [];
  }

  // Set zum Tracking bereits verwendeter IDs
  const seen = new Set();

  return driversList.map((d, index) => {
    let id = d.id;

    // Wenn keine ID vorhanden, verwende den Namen als ID
    if (!id) {
      id = d.name;
    }

    // Wenn die ID bereits verwendet wurde, füge einen Index hinzu für Eindeutigkeit
    if (seen.has(id)) {
      id = `${id}_${index}`;
    }
    seen.add(id);

    // Fahrer mit garantierter eindeutiger ID zurückgeben
    return {
      ...d,
      id: id,
    };
  });
}

/**
 * driversCache - In-Memory Cache für Fahrer-Daten
 *
 * Speichert die zuletzt geladenen Fahrer-Daten, um wiederholte
 * Backend-Aufrufe zu vermeiden. Wird beim Laden gesetzt und kann
 * mit clearDriversCache() zurückgesetzt werden.
 */
let driversCache = null;

/**
 * getStoredDrivers - Lädt alle Fahrer vom Backend
 *
 * Lädt die Fahrer-Daten vom Backend und stellt sicher, dass jeder Fahrer
 * eine eindeutige ID hat. Verwendet einen Cache, um wiederholte Aufrufe zu vermeiden.
 * Falls das Backend leer ist oder ein Fehler auftritt, wird auf defaultDrivers zurückgegriffen.
 *
 * @returns {Promise<Array<Object>>} Liste aller Fahrer mit garantiert eindeutigen IDs
 */
export async function getStoredDrivers() {
  // Wenn Cache vorhanden, verwende diesen (Performance-Optimierung)
  // Kann später für Refreshing erweitert werden
  if (driversCache) {
    return withIds(driversCache);
  }

  try {
    // Dynamischer Import des driverService (verhindert zirkuläre Abhängigkeiten)
    const { getAllDrivers } = await import("../services/driverService.js");
    const drivers = await getAllDrivers();

    // Fallback auf defaultDrivers wenn Backend leer ist
    if (!Array.isArray(drivers) || drivers.length === 0) {
      return withIds(defaultDrivers);
    }

    // Cache setzen für zukünftige Aufrufe
    driversCache = drivers;
    return withIds(drivers);
  } catch (error) {
    // Fehler beim Laden vom Backend → Fallback auf defaultDrivers
    console.error("Fehler beim Laden der Fahrer vom Backend:", error);
    return withIds(defaultDrivers);
  }
}

/**
 * clearDriversCache - Löscht den Fahrer-Cache
 *
 * Wird verwendet, um den Cache zurückzusetzen, z.B. nach dem Speichern
 * von Änderungen, um sicherzustellen, dass beim nächsten Laden die
 * neuesten Daten vom Backend geladen werden.
 */
export function clearDriversCache() {
  driversCache = null;
}

/**
 * saveDrivers - Speichert Fahrer-Änderungen im Backend
 *
 * Speichert eine Liste von Fahrern im Backend und aktualisiert anschließend
 * den lokalen Cache mit den gespeicherten Daten.
 *
 * @param {Array<Object>} drivers - Array von Fahrern, die gespeichert werden sollen
 * @returns {Promise<Array<Object>>} Array der gespeicherten Fahrer (vom Backend zurückgegeben)
 * @throws {Error} Wirft einen Fehler, wenn das Speichern fehlschlägt
 */
export async function saveDrivers(drivers) {
  try {
    // Dynamischer Import des driverService
    const { saveDriversBatch } = await import("../services/driverService.js");
    const saved = await saveDriversBatch(drivers);

    // Cache mit den gespeicherten Daten aktualisieren
    driversCache = saved;

    return saved;
  } catch (error) {
    console.error("Fehler beim Speichern der Fahrer:", error);
    throw error;
  }
}

/**
 * getDriverTeam - Liefert das Team eines Fahrers (synchron)
 *
 * Sucht nach einem Fahrer anhand des Namens und gibt dessen Team zurück.
 * Verwendet den Cache, falls vorhanden, sonst wird in defaultDrivers gesucht.
 *
 * Hinweis: Diese Funktion ist synchron. Für eine asynchrone Version,
 * die sicherstellt, dass die Daten vom Backend geladen sind, siehe getDriverTeamAsync.
 *
 * @param {string} name - Name des Fahrers
 * @returns {string|undefined} Team-Name des Fahrers oder undefined, wenn nicht gefunden
 */
export function getDriverTeam(name) {
  // Zuerst im Cache suchen (schneller)
  if (driversCache) {
    const found = driversCache.find((d) => d.name === name);
    return found?.team;
  }

  // Fallback: Suche in defaultDrivers
  const found = defaultDrivers.find((d) => d.name === name);
  return found?.team;
}

/**
 * getDriverTeamAsync - Liefert das Team eines Fahrers (asynchron)
 *
 * Asynchrone Version von getDriverTeam. Lädt die Fahrer-Daten vom Backend
 * (falls noch nicht im Cache) und sucht dann nach dem Fahrer.
 * Diese Version sollte verwendet werden, wenn sichergestellt werden soll,
 * dass die neuesten Daten vom Backend geladen sind.
 *
 * @param {string} name - Name des Fahrers
 * @returns {Promise<string|undefined>} Team-Name des Fahrers oder undefined, wenn nicht gefunden
 */
export async function getDriverTeamAsync(name) {
  try {
    // Lade Fahrer-Daten (verwendet Cache oder lädt vom Backend)
    const drivers = await getStoredDrivers();
    const found = drivers.find((d) => d.name === name);
    return found?.team;
  } catch (error) {
    console.error("Fehler beim Abrufen des Teams:", error);
    return undefined;
  }
}
