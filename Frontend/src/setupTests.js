/**
 * setupTests.js - Test-Setup-Datei für Vitest/Jest
 *
 * Diese Datei wird automatisch vor jedem Test ausgeführt und konfiguriert
 * die Test-Umgebung. Sie importiert die notwendigen Matcher von
 * @testing-library/jest-dom, die zusätzliche Assertions für DOM-Elemente
 * bereitstellen.
 *
 * Verfügbare Matcher (Beispiele):
 * - toBeInTheDocument()
 * - toHaveClass()
 * - toHaveTextContent()
 * - toBeVisible()
 * - toBeDisabled()
 * - etc.
 *
 * Diese Datei wird von Vitest automatisch geladen, wenn sie im Projekt
 * vorhanden ist (siehe vite.config.js oder package.json).
 */
import "@testing-library/jest-dom";
