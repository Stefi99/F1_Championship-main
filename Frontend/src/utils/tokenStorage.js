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

