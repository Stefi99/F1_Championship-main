// API-Client für Backend-Kommunikation
import { getToken, removeToken } from "./tokenStorage.js";

// API Base URL aus Environment-Variable oder Fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * API-Fehler-Klasse für besseres Error-Handling
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
 * Prüft ob eine Response erfolgreich war
 * @param {Response} response - Die Fetch-Response
 * @returns {Response} Die Response wenn erfolgreich
 * @throws {ApiError} Wenn Response nicht erfolgreich
 */
async function checkResponse(response, endpoint) {
  if (!response.ok) {
    let errorData = null;
    const contentType = response.headers.get("content-type");
    
    // Versuche Error-Daten zu parsen
    try {
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() };
      }
    } catch (e) {
      errorData = { message: response.statusText };
    }

    // Spezielle Behandlung für verschiedene HTTP-Status-Codes
    if (response.status === 401) {
      // 401 Unauthorized: Token entfernen und User ausloggen
      removeToken();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      // TODO: Token-Refresh-Logik hier implementieren, falls Backend Refresh-Token unterstützt
    } else if (response.status === 403) {
      // 403 Forbidden: User hat keine Berechtigung
      // Event für mögliche Weiterleitung (z.B. zu Admin-Bereich)
      window.dispatchEvent(
        new CustomEvent("auth:forbidden", { detail: { endpoint, errorData } })
      );
    } else if (response.status === 404) {
      // 404 Not Found: Ressource existiert nicht
      window.dispatchEvent(
        new CustomEvent("api:not-found", { detail: { endpoint, errorData } })
      );
    } else if (response.status >= 500) {
      // 5xx Server Errors: Server-Fehler
      window.dispatchEvent(
        new CustomEvent("api:server-error", {
          detail: { status: response.status, endpoint, errorData },
        })
      );
    }

    throw new ApiError(
      errorData?.message || errorData?.error || "Ein Fehler ist aufgetreten",
      response.status,
      errorData
    );
  }
  return response;
}

/**
 * Führt einen API-Request aus
 * @param {string} endpoint - Der API-Endpoint (ohne Base-URL)
 * @param {RequestInit} options - Fetch-Optionen
 * @returns {Promise<any>} Die geparste JSON-Response
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  // Token aus Storage holen
  const token = getToken();
  
  // Standard-Headers setzen
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Token zum Header hinzufügen, falls vorhanden
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Request-Optionen zusammenstellen
  const requestOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, requestOptions);
    await checkResponse(response, endpoint);

    // Leere Response (z.B. bei 204 No Content)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return null;
    }

    // JSON parsen
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    // Fallback: Text zurückgeben
    return await response.text();
  } catch (error) {
    // ApiError weiterwerfen
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network-Fehler oder andere Fehler
    throw new ApiError(
      error.message || "Netzwerkfehler",
      0,
      { originalError: error }
    );
  }
}

/**
 * API-Client mit vordefinierten Methoden
 */
export const api = {
  /**
   * GET-Request
   * @param {string} endpoint - Der API-Endpoint
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen
   * @returns {Promise<any>} Die Response-Daten
   */
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "GET",
    });
  },

  /**
   * POST-Request
   * @param {string} endpoint - Der API-Endpoint
   * @param {any} data - Die zu sendenden Daten
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen
   * @returns {Promise<any>} Die Response-Daten
   */
  post: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT-Request
   * @param {string} endpoint - Der API-Endpoint
   * @param {any} data - Die zu sendenden Daten
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen
   * @returns {Promise<any>} Die Response-Daten
   */
  put: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PATCH-Request
   * @param {string} endpoint - Der API-Endpoint
   * @param {any} data - Die zu sendenden Daten
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen
   * @returns {Promise<any>} Die Response-Daten
   */
  patch: (endpoint, data = null, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE-Request
   * @param {string} endpoint - Der API-Endpoint
   * @param {RequestInit} options - Zusätzliche Fetch-Optionen
   * @returns {Promise<any>} Die Response-Daten
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

