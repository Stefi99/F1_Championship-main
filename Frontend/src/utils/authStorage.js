// Verwaltet lokale Benutzerkonten im LocalStorage
const USERS_KEY = "users";

// Normalisiert Strings für Vergleiche (lowercase + trim)
const normalize = (value) => (value || "").trim().toLowerCase();

// Liest Userliste aus dem LocalStorage und wandelt sie in Array um
const readUsers = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("users parse error", error);
    return [];
  }
};

// Speichert die komplette Userliste zurück in LocalStorage
const writeUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("users write error", error);
  }
};

// Erzeugt eindeutige User-ID.
const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Legt neuen localStorage-User an.
export const registerUser = ({ email, username, displayName, password }) => {
  const emailValue = normalize(email);
  const usernameValue = normalize(username);
  const displayValue = normalize(displayName);

  if (!emailValue || !usernameValue || !displayValue || !password) {
    return { error: "Bitte alle Pflichtfelder ausfüllen." };
  }

  const users = readUsers();

  if (users.some((user) => normalize(user.email) === emailValue)) {
    return { error: "Diese E-Mail wird bereits verwendet." };
  }

  if (users.some((user) => normalize(user.username) === usernameValue)) {
    return { error: "Dieser Benutzername ist schon vergeben." };
  }

  if (users.some((user) => normalize(user.displayName) === displayValue)) {
    return { error: "Dieser Anzeigename ist schon vergeben." };
  }

  const now = new Date().toISOString();
  const user = {
    id: createId(),
    email: email.trim(),
    username: username.trim(),
    displayName: displayName.trim(),
    password,
    role: "PLAYER",
    favoriteTeam: "Keines",
    country: "",
    bio: "",
    points: 0,
    createdAt: now,
    lastUpdated: now,
    lastPasswordChange: now,
  };

  users.push(user);
  writeUsers(users);

  return { user };
};

// Login-Funktion
export const authenticateUser = (identifier, password) => {
  const key = normalize(identifier);
  if (!key || !password) {
    return { error: "Bitte Login-Daten eintragen." };
  }

  const users = readUsers();
  const user = users.find(
    (entry) =>
      normalize(entry.email) === key || normalize(entry.username) === key
  );

  if (!user) {
    return { error: "Kein Account mit diesen Daten gefunden." };
  }

  if (user.password !== password) {
    return { error: "Passwort stimmt nicht." };
  }

  return { user: { ...user } };
};

// Aktualisiert bestehendes Nutzerprofil oder legt neues an.
export const upsertUserProfile = (profile) => {
  const users = readUsers();
  const profileId = profile.id;
  const profileUsername = normalize(profile.username);
  const profileEmail = normalize(profile.email);

  const existingIndex = users.findIndex(
    (user) =>
      (profileId && user.id === profileId) ||
      (profileUsername && normalize(user.username) === profileUsername) ||
      (profileEmail && normalize(user.email) === profileEmail)
  );

  const existing = existingIndex >= 0 ? users[existingIndex] : {};
  const merged = {
    ...existing,
    ...profile,
    id: existing.id || profile.id || createId(),
    role: profile.role || existing.role || "PLAYER",
    password: profile.password || existing.password || "",
    lastUpdated:
      profile.lastUpdated || existing.lastUpdated || new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    users[existingIndex] = merged;
  } else {
    users.push(merged);
  }

  writeUsers(users);
  return merged;
};

// Hilfsfunktion zur Anzeige aller gespeicherten Nutzer
export const getAllUsers = () => readUsers();
