/**
 * tokenStorage.js - Verwaltung des JWT-Tokens
 *
 * Stellt Funktionen bereit, um JWT-Tokens sicher zu speichern und zu verwalten.
 *
 * SICHERHEIT:
 * - Verwendet sessionStorage (nicht localStorage) um XSS-Risiko zu reduzieren
 * - Tokens werden beim Schließen des Tabs automatisch gelöscht
 * - Fallback auf In-Memory-Speicher, wenn sessionStorage nicht verfügbar ist
 * - Token-Validierung (Ablaufzeit-Prüfung) für Client-seitige Checks
 *
 * Hinweis: Die finale Token-Validierung erfolgt immer auf dem Backend.
 * Die Client-seitige Validierung dient nur zur Optimierung (verhindert
 * unnötige API-Calls mit abgelaufenen Tokens).
 */
const TOKEN_KEY = "jwt_token";
let memoryToken = null;

/**
 * getSessionStore - Gibt den sessionStorage zurück oder null
 *
 * Prüft, ob sessionStorage verfügbar ist. Kann in folgenden Fällen fehlschlagen:
 * - Server-Side Rendering (SSR) - window ist nicht definiert
 * - Privacy-Modi in Browsern - sessionStorage ist blockiert
 * - Incognito-Modi - sessionStorage kann deaktiviert sein
 *
 * @returns {Storage|null} sessionStorage-Objekt oder null wenn nicht verfügbar
 */
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
 * setToken - Speichert das JWT-Token
 *
 * Speichert das Token in sessionStorage (wenn verfügbar) oder im
 * In-Memory-Speicher als Fallback. Wenn token null/undefined ist,
 * wird das Token entfernt (Logout).
 *
 * @param {string|null|undefined} token - Das JWT-Token oder null/undefined zum Entfernen
 */
export function setToken(token) {
  const store = getSessionStore();

  // Wenn kein Token übergeben wurde, entferne das gespeicherte Token
  if (!token) {
    removeToken();
    return;
  }

  // Versuche in sessionStorage zu speichern
  if (store) {
    store.setItem(TOKEN_KEY, token);
    memoryToken = null; // In-Memory-Token zurücksetzen
    return;
  }

  // Fallback: Nur innerhalb der laufenden Session im Speicher
  // Wird beim Neuladen der Seite verloren gehen
  memoryToken = token;
}

/**
 * getToken - Liest das gespeicherte JWT-Token
 *
 * Versucht das Token aus sessionStorage zu lesen. Falls nicht verfügbar,
 * wird das In-Memory-Token zurückgegeben.
 *
 * @returns {string|null} Das Token oder null wenn kein Token vorhanden
 */
export function getToken() {
  const store = getSessionStore();
  if (store) {
    return store.getItem(TOKEN_KEY);
  }

  // Fallback: In-Memory-Token
  return memoryToken;
}

/**
 * removeToken - Entfernt das gespeicherte Token
 *
 * Löscht das Token sowohl aus sessionStorage als auch aus dem
 * In-Memory-Speicher. Entfernt auch die gespeicherte User-ID.
 *
 * Wird verwendet beim Logout oder wenn das Token ungültig wird.
 */
export function removeToken() {
  const store = getSessionStore();
  if (store) {
    store.removeItem(TOKEN_KEY);
  }
  memoryToken = null;
  // User-ID auch entfernen (wird zusammen mit Token gespeichert)
  removeUserId();
}

/**
 * hasToken - Prüft ob ein Token vorhanden ist
 *
 * Einfache Prüfung, ob ein Token gespeichert ist. Prüft NICHT,
 * ob das Token gültig ist (siehe isTokenValid()).
 *
 * @returns {boolean} true wenn Token vorhanden ist (auch wenn abgelaufen)
 */
export function hasToken() {
  return !!getToken();
}

/**
 * isTokenValid - Prüft ob das Token gültig ist (nicht abgelaufen)
 *
 * Dekodiert das JWT-Token und prüft die Ablaufzeit (exp-Feld).
 * Dies ist eine clientseitige Prüfung zur Optimierung - die finale
 * Validierung erfolgt immer auf dem Backend.
 *
 * WICHTIG: Diese Funktion prüft nur die Ablaufzeit, nicht die Signatur!
 * Die Signatur-Validierung erfolgt nur auf dem Backend.
 *
 * @returns {boolean} true wenn Token vorhanden und nicht abgelaufen
 *                    false wenn kein Token vorhanden, abgelaufen oder ungültig
 */
export function isTokenValid() {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    // JWT besteht aus drei Teilen, getrennt durch Punkte: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      // Ungültiges JWT-Format
      return false;
    }

    // Payload dekodieren (Base64URL-kodiert)
    // atob() dekodiert Base64, JSON.parse() konvertiert zu Objekt
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
    // Bei Parsing-Fehler: Token ist ungültig (z.B. kein gültiges JSON)
    console.error("Fehler beim Validieren des Tokens:", error);
    return false;
  }
}

/**
 * User-ID Storage
 *
 * Die User-ID wird zusammen mit dem Token gespeichert, da das
 * UserProfileDTO vom Backend keine ID enthält. Die ID wird beim
 * Login aus der AuthResponse extrahiert und hier gespeichert.
 */
const USER_ID_KEY = "user_id";

/**
 * setUserId - Speichert die User-ID
 *
 * Speichert die User-ID in sessionStorage (wenn verfügbar).
 * Die ID wird als String gespeichert, um Konsistenz zu gewährleisten.
 *
 * Wird beim Login aufgerufen, um die ID aus der AuthResponse zu speichern.
 * Die ID wird benötigt, da UserProfileDTO keine ID enthält.
 *
 * @param {number|string|null} userId - Die User-ID oder null zum Entfernen
 */
export function setUserId(userId) {
  const store = getSessionStore();

  // Wenn keine ID übergeben wurde, entferne die gespeicherte ID
  if (!userId) {
    removeUserId();
    return;
  }

  // Speichere ID als String für Konsistenz
  if (store) {
    store.setItem(USER_ID_KEY, String(userId));
    return;
  }

  // Hinweis: In-Memory-Fallback für User-ID wird nicht implementiert,
  // da sessionStorage in den meisten Fällen verfügbar ist
}

/**
 * getUserId - Liest die gespeicherte User-ID
 *
 * Liest die User-ID aus sessionStorage. Gibt null zurück, wenn
 * keine ID gespeichert ist oder sessionStorage nicht verfügbar ist.
 *
 * @returns {string|null} Die User-ID als String oder null
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
 * removeUserId - Entfernt die gespeicherte User-ID
 *
 * Löscht die User-ID aus sessionStorage. Wird automatisch von
 * removeToken() aufgerufen, um Konsistenz zu gewährleisten.
 */
export function removeUserId() {
  const store = getSessionStore();
  if (store) {
    store.removeItem(USER_ID_KEY);
  }
}
