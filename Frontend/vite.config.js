import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
  // Environment-Variablen werden automatisch von Vite geladen
  // Alle Variablen die mit VITE_ beginnen sind im Client-Code verfügbar
  // via import.meta.env.VITE_API_BASE_URL
});
