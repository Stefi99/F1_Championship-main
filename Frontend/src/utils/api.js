/**
 * api.js - Zentrale API-Client-Utility für Backend-Kommunikation
 *
 * Stellt einen zentralen API-Client bereit, der:
 * - Automatisch JWT-Tokens zu Requests hinzufügt
 * - Einheitliche Fehlerbehandlung bietet (ApiError-Klasse)
 * - HTTP-Status-Codes behandelt (401, 403, 404, 5xx)
 * - Custom Events für spezielle Fehlerfälle auslöst
 * - JSON-Parsing und Content-Type-Handling übernimmt
 *
 * Alle Service-Module sollten diesen API-Client verwenden, um
 * Konsistenz und zentrale Fehlerbehandlung zu gewährleisten.
 */
import { getToken, removeToken } from "./tokenStorage.js";

/**
 * API_BASE_URL - Basis-URL für alle API-Requests
 *
 * Wird aus der Environment-Variable VITE_API_BASE_URL geladen.
 * Fallback auf localhost:8080/api für lokale Entwicklung.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * ApiError - Spezielle Error-Klasse für API-Fehler
 *
 * Erweitert die Standard Error-Klasse um:
 * - status: HTTP-Status-Code (z.B. 401, 404, 500)
 * - data: Zusätzliche Fehlerdaten vom Backend (optional)
 *
 * Ermöglicht differenziertes Error-Handling basierend auf Status-Codes.
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * checkResponse - Prüft ob eine HTTP-Response erfolgreich war
 *
 * Analysiert den HTTP-Status-Code und behandelt Fehler entsprechend:
 * - 401: Entfernt Token und löst auth:unauthorized Event aus
 * - 403: Löst auth:forbidden Event aus
 * - 404: Löst api:not-found Event aus
 * - 5xx: Löst api:server-error Event aus
 *
 * Versucht, Fehlerdaten aus der Response zu extrahieren (JSON oder Text).
 * Wirft eine ApiError mit Status-Code und Fehlerdaten.
 *
 * @param {Response} response - Die Fetch-Response
 * @param {string} endpoint - Der API-Endpoint (für Event-Details)
 * @returns {Response} Die Response wenn erfolgreich (status 200-299)
 * @throws {ApiError} Wenn Response nicht erfolgreich (status >= 400)
 */
async function checkResponse(response, endpoint) {
  if (!response.ok) {
    let errorData = null;
    const contentType = response.headers.get("content-type");

    // Versuche Error-Daten zu parsen (JSON oder Text)
    try {
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        // Fallback: Als Text parsen
        errorData = { message: await response.text() };
      }
    } catch (e) {
      // Wenn Parsing fehlschlägt, verwende Status-Text
      errorData = { message: response.statusText };
    }

    // Spezielle Behandlung für verschiedene HTTP-Status-Codes

    // 401 Unauthorized: Token ist ungültig oder abgelaufen
    if (response.status === 401) {
      // Token entfernen, da es ungültig ist
      removeToken();
      // Event auslösen, damit AuthProvider reagieren kann
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      // TODO: Token-Refresh-Logik hier implementieren, falls Backend Refresh-Token unterstützt
    }
    // 403 Forbidden: User hat keine Berechtigung für diese Aktion
    else if (response.status === 403) {
      // Event für mögliche Weiterleitung (z.B. zu Admin-Bereich)
      window.dispatchEvent(
        new CustomEvent("auth:forbidden", { detail: { endpoint, errorData } })
      );
    }
    // 404 Not Found: Ressource existiert nicht
    else if (response.status === 404) {
      window.dispatchEvent(
        new CustomEvent("api:not-found", { detail: { endpoint, errorData } })
      );
    }
    // 5xx Server Errors: Server-seitige Fehler
    else if (response.status >= 500) {
      window.dispatchEvent(
        new CustomEvent("api:server-error", {
          detail: { status: response.status, endpoint, errorData },
        })
      );
    }

    // ApiError mit Status-Code und Fehlerdaten werfen
    throw new ApiError(
      errorData?.message || errorData?.error || "Ein Fehler ist aufgetreten",
      response.status,
      errorData
    );
  }
  return response;
}

/**
 * apiRequest - Führt einen API-Request aus
 *
 * Zentrale Funktion für alle HTTP-Requests zum Backend:
 * - Konstruiert die vollständige URL (Base-URL + Endpoint)
 * - Fügt automatisch JWT-Token zum Authorization-Header hinzu
 * - Setzt Standard-Headers (Content-Type: application/json)
 * - Behandelt Response-Parsing (JSON, Text, leer)
 * - Fehlerbehandlung über checkResponse()
 *
 * @param {string} endpoint - Der API-Endpoint (ohne Base-URL, z.B. "/races" oder "races")
 * @param {RequestInit} options - Fetch-Optionen (method, body, headers, etc.)
 * @returns {Promise<any>} Die geparste Response (JSON, Text oder null)
 * @throws {ApiError} Bei HTTP-Fehlern oder Netzwerkfehlern
 */
async function apiRequest(endpoint, options = {}) {
  // Konstruiere vollständige URL
  // Endpoint kann mit oder ohne führendem Slash sein
  const url = `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  // Token aus Storage holen (falls vorhanden)
  const token = getToken();

  // Standard-Headers setzen
  // Content-Type wird automatisch auf application/json gesetzt
  const headers = {
    "Content-Type": "application/json",
    ...options.headers, // Benutzerdefinierte Headers können überschreiben
  };

  // Token zum Authorization-Header hinzufügen, falls vorhanden
  // Format: "Bearer <token>" (JWT-Standard)
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Request-Optionen zusammenstellen
  const requestOptions = {
    ...options,
    headers,
  };

  try {
    // HTTP-Request ausführen
    const response = await fetch(url, requestOptions);

    // Response validieren und Fehler behandeln
    await checkResponse(response, endpoint);

    // Leere Response behandeln (z.B. bei 204 No Content)
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return null;
    }

    // Response-Parsing basierend auf Content-Type
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      // JSON-Response parsen
      return await response.json();
    }

    // Fallback: Als Text zurückgeben (falls kein JSON)
    return await response.text();
  } catch (error) {
    // ApiError weiterwerfen (wurde bereits in checkResponse erstellt)
    if (error instanceof ApiError) {
      throw error;
    }

    // Network-Fehler oder andere unerwartete Fehler
    // Status 0 bedeutet: Request konnte nicht ausgeführt werden
    throw new ApiError(error.message || "Netzwerkfehler", 0, {
      originalError: error,
    });
  }
}

/**
 * api - API-Client mit vordefinierten HTTP-Methoden
 *
 * Stellt eine einfache, konsistente API für HTTP-Requests bereit.
 * Alle Methoden verwenden intern apiRequest() für einheitliche
 * Fehlerbehandlung und Token-Verwaltung.
 *
 * Verwendung:
 *   import api from "./utils/api.js";
 *   const data = await api.get("/races");
 *   await api.post("/races", raceData);
 */
export const api = {
  /**
   * GET-Request - Lädt Daten vom Backend
   *
   * @param {string} endpoint - Der API-Endpoint (z.B. "/races" oder "/users/me")
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen (optional)
   * @returns {Promise<any>} Die Response-Daten (geparst als JSON oder Text)
   * @throws {ApiError} Bei HTTP-Fehlern oder Netzwerkfehlern
   */
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "GET",
    });
  },

  /**
   * POST-Request - Erstellt neue Ressourcen oder führt Aktionen aus
   *
   * @param {string} endpoint - Der API-Endpoint
   * @param {any} data - Die zu sendenden Daten (wird automatisch zu JSON stringified)
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen (optional)
   * @returns {Promise<any>} Die Response-Daten
   * @throws {ApiError} Bei HTTP-Fehlern oder Netzwerkfehlern
   */
  post: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT-Request - Aktualisiert eine gesamte Ressource
   *
   * @param {string} endpoint - Der API-Endpoint
   * @param {any} data - Die zu sendenden Daten (wird automatisch zu JSON stringified)
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen (optional)
   * @returns {Promise<any>} Die Response-Daten
   * @throws {ApiError} Bei HTTP-Fehlern oder Netzwerkfehlern
   */
  put: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PATCH-Request - Aktualisiert Teile einer Ressource
   *
   * @param {string} endpoint - Der API-Endpoint
   * @param {any} data - Die zu sendenden Daten (wird automatisch zu JSON stringified)
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen (optional)
   * @returns {Promise<any>} Die Response-Daten
   * @throws {ApiError} Bei HTTP-Fehlern oder Netzwerkfehlern
   */
  patch: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE-Request - Löscht eine Ressource
   *
   * @param {string} endpoint - Der API-Endpoint
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen (optional)
   * @returns {Promise<any>} Die Response-Daten (oft null bei erfolgreichem Löschen)
   * @throws {ApiError} Bei HTTP-Fehlern oder Netzwerkfehlern
   */
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};

// Export der Base-URL für externe Verwendung
export { API_BASE_URL };

export default api;
