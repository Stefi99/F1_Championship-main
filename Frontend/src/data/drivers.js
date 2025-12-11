// Zuordnung für CSS-Teamfarben
export const TEAM_CLASS_MAP = {
  "Red Bull": "team-red-bull",
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
  { id: "max-verstappen", name: "Max Verstappen", team: "Red Bull" },
  { id: "sergio-perez", name: "Sergio Perez", team: "Red Bull" },
  { id: "charles-leclerc", name: "Charles Leclerc", team: "Ferrari" },
  { id: "carlos-sainz", name: "Carlos Sainz", team: "Ferrari" },
  { id: "lewis-hamilton", name: "Lewis Hamilton", team: "Mercedes" },
  { id: "george-russell", name: "George Russell", team: "Mercedes" },
  { id: "lando-norris", name: "Lando Norris", team: "McLaren" },
  { id: "oscar-piastri", name: "Oscar Piastri", team: "McLaren" },
  { id: "fernando-alonso", name: "Fernando Alonso", team: "Aston Martin" },
  { id: "lance-stroll", name: "Lance Stroll", team: "Aston Martin" },
  { id: "esteban-ocon", name: "Esteban Ocon", team: "Alpine" },
  { id: "pierre-gasly", name: "Pierre Gasly", team: "Alpine" },
  { id: "valtteri-bottas", name: "Valtteri Bottas", team: "Sauber" },
  { id: "guanyu-zhou", name: "Guanyu Zhou", team: "Sauber" },
  { id: "kevin-magnussen", name: "Kevin Magnussen", team: "Haas" },
  { id: "nico-hulkenberg", name: "Nico Hulkenberg", team: "Haas" },
  { id: "alex-albon", name: "Alex Albon", team: "Williams" },
  { id: "logan-sargeant", name: "Logan Sargeant", team: "Williams" },
  { id: "yuki-tsunoda", name: "Yuki Tsunoda", team: "RB" },
  { id: "daniel-ricciardo", name: "Daniel Ricciardo", team: "RB" },
];

//wenn Fahrer keine ID hat dann wird Namen angezeigt
function withIds(driversList) {
  return (driversList || []).map((d) => ({
    ...d,
    id: d.id || d.name,
  }));
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
