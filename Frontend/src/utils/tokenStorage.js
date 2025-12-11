// Verwaltung des JWT-Tokens
// Nutzung von sessionStorage (nicht persistent über Tabs) mit Fallback auf In-Memory,
// um XSS-Risiko durch dauerhaft gespeicherte Tokens zu reduzieren.
const TOKEN_KEY = "jwt_token";
let memoryToken = null;

const getSessionStore = () => {
  try {
    return typeof window !== "undefined" ? window.sessionStorage : null;
  } catch (err) {
    // Zugriff kann z.B. in Privacy- oder SSR-Umgebungen fehlschlagen
    console.warn(
      "SessionStorage nicht verfügbar, verwende In-Memory-Token.",
      err
    );
    return null;
  }
};

/**
 * Speichert das JWT-Token
 * @param {string} token - Das JWT-Token
 */
export function setToken(token) {
  const store = getSessionStore();
  if (!token) {
    removeToken();
    return;
  }

  if (store) {
    store.setItem(TOKEN_KEY, token);
    memoryToken = null;
    return;
  }

  // Fallback: nur innerhalb der laufenden Session im Speicher
  memoryToken = token;
}

/**
 * Liest das gespeicherte JWT-Token
 * @returns {string|null} Das Token oder null
 */
export function getToken() {
  const store = getSessionStore();
  if (store) {
    return store.getItem(TOKEN_KEY);
  }

  return memoryToken;
}

/**
 * Entfernt das gespeicherte Token
 */
export function removeToken() {
  const store = getSessionStore();
  if (store) {
    store.removeItem(TOKEN_KEY);
  }
  memoryToken = null;
  // User-ID auch entfernen
  removeUserId();
}

/**
 * Prüft ob ein Token vorhanden ist
 * @returns {boolean} true wenn Token vorhanden
 */
export function hasToken() {
  return !!getToken();
}

/**
 * Prüft ob das Token gültig ist (nicht abgelaufen)
 * Hinweis: Dies ist eine clientseitige Prüfung. Die finale Validierung erfolgt immer auf dem Backend.
 * @returns {boolean} true wenn Token vorhanden und nicht abgelaufen
 */
export function isTokenValid() {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    // JWT besteht aus drei Teilen: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // Payload dekodieren (Base64)
    const payload = JSON.parse(atob(parts[1]));

    // Prüfe Ablaufzeit (exp = expiration time in Sekunden seit Unix-Epoch)
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // In Millisekunden umwandeln
      const currentTime = Date.now();

      // Token ist abgelaufen wenn aktuelle Zeit >= Ablaufzeit
      if (currentTime >= expirationTime) {
        return false;
      }
    }

    // Token ist vorhanden und nicht abgelaufen (oder hat kein exp-Feld)
    return true;
  } catch (error) {
    // Bei Parsing-Fehler: Token ist ungültig
    console.error("Fehler beim Validieren des Tokens:", error);
    return false;
  }
}

// User-ID Storage (wird zusammen mit dem Token gespeichert)
const USER_ID_KEY = "user_id";

/**
 * Speichert die User-ID
 * @param {number|string|null} userId - Die User-ID
 */
export function setUserId(userId) {
  const store = getSessionStore();
  if (!userId) {
    removeUserId();
    return;
  }

  if (store) {
    store.setItem(USER_ID_KEY, String(userId));
    return;
  }
}

/**
 * Liest die gespeicherte User-ID
 * @returns {string|null} Die User-ID oder null
 */
export function getUserId() {
  const store = getSessionStore();
  if (store) {
    const userId = store.getItem(USER_ID_KEY);
    return userId ? userId : null;
  }
  return null;
}

/**
 * Entfernt die gespeicherte User-ID
 */
export function removeUserId() {
  const store = getSessionStore();
  if (store) {
    store.removeItem(USER_ID_KEY);
  }
}
