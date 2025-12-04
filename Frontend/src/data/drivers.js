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

function withIds(driversList) {
  return (driversList || []).map((d) => ({
    ...d,
    id: d.id || d.name,
  }));
}

export function getStoredDrivers() {
  try {
    const raw = localStorage.getItem("driversData");
    if (!raw) return withIds(defaultDrivers);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return withIds(defaultDrivers);
    return withIds(parsed);
  } catch (err) {
    console.error("driversData parse error", err);
    return withIds(defaultDrivers);
  }
}

export function saveDrivers(drivers) {
  try {
    localStorage.setItem("driversData", JSON.stringify(drivers));
  } catch (err) {
    console.error("driversData save error", err);
  }
}

export function getDriverTeam(name) {
  const drivers = getStoredDrivers();
  const found = drivers.find((d) => d.name === name);
  return found?.team;
}
