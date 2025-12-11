// Zuordnung für CSS-Teamfarben
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

export const TEAM_OPTIONS = Object.keys(TEAM_CLASS_MAP);

//Standart Liste aller F1-Fahrer
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

//wenn Fahrer keine ID hat dann wird Namen angezeigt
function withIds(driversList) {
  if (!Array.isArray(driversList)) {
    return [];
  }

  // Sicherstellen, dass jeder Fahrer eine eindeutige ID hat
  const seen = new Set();
  return driversList.map((d, index) => {
    let id = d.id;

    // Wenn keine ID vorhanden, verwende den Namen
    if (!id) {
      id = d.name;
    }

    // Wenn die ID bereits verwendet wurde, füge einen Index hinzu
    if (seen.has(id)) {
      id = `${id}_${index}`;
    }
    seen.add(id);

    return {
      ...d,
      id: id,
    };
  });
}

// Cache für Fahrer-Daten (wird beim Laden gesetzt)
let driversCache = null;

/**
 * Lädt alle Fahrer vom Backend
 * @returns {Promise<Array>} Liste aller Fahrer mit IDs
 */
export async function getStoredDrivers() {
  // Wenn Cache vorhanden, verwende diesen (kann später für Refreshing erweitert werden)
  if (driversCache) {
    return withIds(driversCache);
  }

  try {
    const { getAllDrivers } = await import("../services/driverService.js");
    const drivers = await getAllDrivers();

    // Fallback auf defaultDrivers wenn Backend leer ist
    if (!Array.isArray(drivers) || drivers.length === 0) {
      return withIds(defaultDrivers);
    }

    // Cache setzen
    driversCache = drivers;
    return withIds(drivers);
  } catch (error) {
    console.error("Fehler beim Laden der Fahrer vom Backend:", error);
    // Fallback auf defaultDrivers bei Fehler
    return withIds(defaultDrivers);
  }
}

/**
 * Synchronisiert den Cache (für nach dem Speichern)
 */
export function clearDriversCache() {
  driversCache = null;
}

/**
 * Speichert Fahrer-Änderungen im Backend
 * @param {Array<Object>} drivers - Array von Fahrern
 * @returns {Promise<Array>} Array der gespeicherten Fahrer
 */
export async function saveDrivers(drivers) {
  try {
    const { saveDriversBatch } = await import("../services/driverService.js");
    const saved = await saveDriversBatch(drivers);

    // Cache aktualisieren
    driversCache = saved;

    return saved;
  } catch (error) {
    console.error("Fehler beim Speichern der Fahrer:", error);
    throw error;
  }
}

/**
 * Liefert das Team eines Fahrers (synchron, verwendet Cache)
 * Für async-Version siehe getDriverTeamAsync
 * @param {string} name - Name des Fahrers
 * @returns {string|undefined} Team-Name oder undefined
 */
export function getDriverTeam(name) {
  if (driversCache) {
    const found = driversCache.find((d) => d.name === name);
    return found?.team;
  }

  // Fallback: Suche in defaultDrivers
  const found = defaultDrivers.find((d) => d.name === name);
  return found?.team;
}

/**
 * Async-Version von getDriverTeam (lädt vom Backend)
 * @param {string} name - Name des Fahrers
 * @returns {Promise<string|undefined>} Team-Name oder undefined
 */
export async function getDriverTeamAsync(name) {
  try {
    const drivers = await getStoredDrivers();
    const found = drivers.find((d) => d.name === name);
    return found?.team;
  } catch (error) {
    console.error("Fehler beim Abrufen des Teams:", error);
    return undefined;
  }
}
