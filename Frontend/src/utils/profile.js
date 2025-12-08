import { upsertUserProfile } from "./authStorage";

const DEFAULT_PLAYER_PROFILE = {
  username: "player",
  displayName: "Racing Fan",
  email: "player@example.com",
  favoriteTeam: "Ferrari",
  country: "Schweiz",
  bio: "Bereit fuer die naechste Session.",
  points: 0,
  lastUpdated: null,
  lastPasswordChange: null,
  role: "PLAYER",
};

function safeParseProfile(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    return {};
  } catch (err) {
    console.error("playerProfile parse error", err);
    return {};
  }
}

export function loadPlayerProfile() {
  const stored = safeParseProfile(localStorage.getItem("playerProfile"));
  const fallbackLastUpdated =
    stored.lastUpdated || DEFAULT_PLAYER_PROFILE.lastUpdated || new Date().toISOString();
  const parsedPoints = Number.isNaN(Number(stored.points))
    ? DEFAULT_PLAYER_PROFILE.points
    : Number(stored.points);
  return {
    ...DEFAULT_PLAYER_PROFILE,
    ...stored,
    username: stored.username || DEFAULT_PLAYER_PROFILE.username,
    role: stored.role || DEFAULT_PLAYER_PROFILE.role || "PLAYER",
    lastUpdated: fallbackLastUpdated,
    points: parsedPoints,
  };
}

export function persistPlayerProfile(profile) {
  const parsedPoints = Number.isNaN(Number(profile.points))
    ? DEFAULT_PLAYER_PROFILE.points
    : Number(profile.points);
  const next = {
    ...DEFAULT_PLAYER_PROFILE,
    ...profile,
    username: profile.username || DEFAULT_PLAYER_PROFILE.username,
    role: profile.role || DEFAULT_PLAYER_PROFILE.role || "PLAYER",
    lastUpdated: new Date().toISOString(),
    points: parsedPoints,
  };

  try {
    const synced = upsertUserProfile(next);
    localStorage.setItem("playerProfile", JSON.stringify(synced));
    localStorage.setItem("user", JSON.stringify(synced));
    return synced;
  } catch (err) {
    console.error("playerProfile save error", err);
  }

  return next;
}
