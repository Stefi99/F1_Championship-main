// Utility-Funktionen für einheitliches Error-Handling
import { ApiError } from "./api.js";

/**
 * Konvertiert einen API-Fehler in eine benutzerfreundliche Fehlermeldung
 * @param {Error|ApiError} error - Der Fehler
 * @returns {string} Benutzerfreundliche Fehlermeldung
 */
export function getErrorMessage(error) {
  // ApiError mit Status-Code
  if (error instanceof ApiError) {
    const status = error.status;
    const message = error.message || error.data?.message || error.data?.error;

    // Spezifische Fehlermeldungen basierend auf Status-Code
    switch (status) {
      case 400:
        return message || "Ungültige Anfrage. Bitte überprüfe deine Eingaben.";
      case 401:
        return "Du bist nicht angemeldet. Bitte melde dich an.";
      case 403:
        return "Du hast keine Berechtigung für diese Aktion.";
      case 404:
        return message || "Die angeforderte Ressource wurde nicht gefunden.";
      case 409:
        return message || "Ein Konflikt ist aufgetreten. Die Daten existieren bereits.";
      case 422:
        return message || "Die Daten konnten nicht verarbeitet werden.";
      case 500:
        return "Ein Serverfehler ist aufgetreten. Bitte versuche es später erneut.";
      case 502:
      case 503:
      case 504:
        return "Der Server ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.";
      default:
        return message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";
    }
  }

  // Network-Fehler (Status 0)
  if (error instanceof ApiError && error.status === 0) {
    return "Verbindungsfehler. Bitte überprüfe deine Internetverbindung.";
  }

  // Standard JavaScript Error
  if (error instanceof Error) {
    return error.message || "Ein unerwarteter Fehler ist aufgetreten.";
  }

  // Fallback
  return "Ein unbekannter Fehler ist aufgetreten.";
}

/**
 * Prüft ob ein Fehler ein bestimmter HTTP-Status ist
 * @param {Error|ApiError} error - Der Fehler
 * @param {number} status - Der HTTP-Status-Code
 * @returns {boolean}
 */
export function isErrorStatus(error, status) {
  return error instanceof ApiError && error.status === status;
}

/**
 * Prüft ob ein Fehler ein Authentifizierungsfehler ist (401)
 * @param {Error|ApiError} error - Der Fehler
 * @returns {boolean}
 */
export function isAuthError(error) {
  return isErrorStatus(error, 401);
}

/**
 * Prüft ob ein Fehler ein Berechtigungsfehler ist (403)
 * @param {Error|ApiError} error - Der Fehler
 * @returns {boolean}
 */
export function isForbiddenError(error) {
  return isErrorStatus(error, 403);
}

/**
 * Prüft ob ein Fehler ein Netzwerkfehler ist
 * @param {Error|ApiError} error - Der Fehler
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return (
    (error instanceof ApiError && error.status === 0) ||
    (error instanceof Error && error.message?.includes("fetch"))
  );
}

