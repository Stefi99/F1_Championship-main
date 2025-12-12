/**
 * main.jsx - Einstiegspunkt der React-Anwendung
 *
 * Diese Datei ist der Einstiegspunkt für die gesamte F1 Championship Anwendung.
 * Sie rendert die Root-Komponente in das DOM und stellt die notwendigen
 * Provider-Komponenten bereit:
 *
 * - React.StrictMode: Aktiviert zusätzliche Entwickler-Warnungen
 * - AuthProvider: Stellt Authentifizierungs-Kontext für die gesamte App bereit
 * - BrowserRouter: Ermöglicht Client-seitiges Routing
 * - AppRouter: Definiert alle Routen der Anwendung
 *
 * Die Reihenfolge der Provider ist wichtig:
 * 1. AuthProvider muss außen sein, damit alle Komponenten Zugriff auf Auth-Kontext haben
 * 2. BrowserRouter muss innerhalb von AuthProvider sein, damit Router-Hooks funktionieren
 * 3. AppRouter verwendet beide Kontexte für Routing und Authentifizierung
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./contexts/AuthProvider.jsx";
import AppRouter from "./router/AppRouter.jsx";

import "./index.css";

/**
 * Rendert die Anwendung in das DOM
 *
 * Die Komponenten-Hierarchie:
 * React.StrictMode
 *   └─ AuthProvider (Authentifizierungs-Kontext)
 *       └─ BrowserRouter (Router-Kontext)
 *           └─ AppRouter (Route-Definitionen)
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* AuthProvider: Stellt Authentifizierungs-State für die gesamte App bereit */}
    <AuthProvider>
      {/* BrowserRouter: Ermöglicht Client-seitiges Routing mit react-router-dom */}
      <BrowserRouter>
        {/* AppRouter: Definiert alle Routen (Home, Auth, Player, Admin) */}
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
