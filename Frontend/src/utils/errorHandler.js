/**
 * errorHandler.js - Utility-Funktionen für einheitliches Error-Handling
 *
 * Stellt Funktionen bereit, um Fehler in benutzerfreundliche Meldungen
 * umzuwandeln und Fehlertypen zu identifizieren.
 *
 * Alle Komponenten sollten diese Funktionen verwenden, um konsistente
 * Fehlermeldungen anzuzeigen.
 */
import { ApiError } from "./api.js";

/**
 * getErrorMessage - Konvertiert einen Fehler in eine benutzerfreundliche Meldung
 *
 * Analysiert den Fehlertyp und HTTP-Status-Code, um eine passende
 * deutsche Fehlermeldung zu generieren. Berücksichtigt:
 * - ApiError mit Status-Codes (400, 401, 403, 404, 409, 422, 5xx)
 * - Network-Fehler (Status 0)
 * - Standard JavaScript Errors
 *
 * @param {Error|ApiError} error - Der Fehler (kann ApiError, Error oder anderes sein)
 * @returns {string} Benutzerfreundliche deutsche Fehlermeldung
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
        return (
          message ||
          "Ein Konflikt ist aufgetreten. Die Daten existieren bereits."
        );
      case 422:
        return message || "Die Daten konnten nicht verarbeitet werden.";
      case 500:
        return "Ein Serverfehler ist aufgetreten. Bitte versuche es später erneut.";
      case 502:
      case 503:
      case 504:
        return "Der Server ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.";
      default:
        return (
          message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut."
        );
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
 * isErrorStatus - Prüft ob ein Fehler einen bestimmten HTTP-Status hat
 *
 * Hilfsfunktion zur Typ-Prüfung von ApiErrors.
 *
 * @param {Error|ApiError} error - Der zu prüfende Fehler
 * @param {number} status - Der HTTP-Status-Code (z.B. 401, 404, 500)
 * @returns {boolean} true wenn Fehler ein ApiError mit dem angegebenen Status ist
 */
export function isErrorStatus(error, status) {
  return error instanceof ApiError && error.status === status;
}

/**
 * isAuthError - Prüft ob ein Fehler ein Authentifizierungsfehler ist (401)
 *
 * 401 Unauthorized bedeutet, dass der Benutzer nicht authentifiziert ist
 * oder das Token ungültig/abgelaufen ist.
 *
 * @param {Error|ApiError} error - Der zu prüfende Fehler
 * @returns {boolean} true wenn Fehler ein 401 Unauthorized ist
 */
export function isAuthError(error) {
  return isErrorStatus(error, 401);
}

/**
 * isForbiddenError - Prüft ob ein Fehler ein Berechtigungsfehler ist (403)
 *
 * 403 Forbidden bedeutet, dass der Benutzer authentifiziert ist, aber
 * keine Berechtigung für die angeforderte Aktion hat.
 *
 * @param {Error|ApiError} error - Der zu prüfende Fehler
 * @returns {boolean} true wenn Fehler ein 403 Forbidden ist
 */
export function isForbiddenError(error) {
  return isErrorStatus(error, 403);
}

/**
 * isNetworkError - Prüft ob ein Fehler ein Netzwerkfehler ist
 *
 * Netzwerkfehler treten auf, wenn:
 * - Die Verbindung zum Server nicht hergestellt werden kann (Status 0)
 * - Ein Fetch-Fehler auftritt (z.B. CORS, Timeout)
 *
 * @param {Error|ApiError} error - Der zu prüfende Fehler
 * @returns {boolean} true wenn Fehler ein Netzwerkfehler ist
 */
export function isNetworkError(error) {
  return (
    (error instanceof ApiError && error.status === 0) ||
    (error instanceof Error && error.message?.includes("fetch"))
  );
}
