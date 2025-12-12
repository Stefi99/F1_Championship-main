/**
 * AuthContext - React Context für Authentifizierung
 *
 * Dieser Context wird verwendet, um Authentifizierungsinformationen
 * (User-Daten, Login-Status, Admin-Status) und Funktionen (login, logout, refreshUser)
 * in der gesamten Anwendung verfügbar zu machen.
 *
 * Der Context selbst wird hier nur erstellt. Die tatsächliche Implementierung
 * und der Provider befinden sich in AuthProvider.jsx
 */
import { createContext } from "react";

// Context erstellen (initialer Wert ist null, wird vom AuthProvider gesetzt)
export const AuthContext = createContext(null);
