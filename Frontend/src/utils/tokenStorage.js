// Verwaltung des JWT-Tokens
const TOKEN_KEY = "jwt_token";

/**
 * Speichert das JWT-Token
 * @param {string} token - Das JWT-Token
 */
export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    removeToken();
  }
}

/**
 * Liest das gespeicherte JWT-Token
 * @returns {string|null} Das Token oder null
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Entfernt das gespeicherte Token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
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

