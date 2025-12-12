/**
 * Layout - Hauptlayout-Komponente der Anwendung
 *
 * Diese Komponente definiert die grundlegende Struktur aller Seiten:
 * - Navbar: Navigationsleiste oben
 * - Main: Hauptinhalt (wird durch React Router Outlet gefüllt)
 * - Footer: Fußzeile mit Copyright-Informationen
 *
 * Wird als Wrapper um alle Hauptseiten verwendet, um eine konsistente
 * Seitenstruktur zu gewährleisten.
 */
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  return (
    <div className="f1-shell">
      {/* Navigationsleiste - erscheint auf allen Seiten */}
      <Navbar />

      {/* Hauptinhalt - wird durch die aktuelle Route gefüllt */}
      <main className="f1-main">
        <Outlet />
      </main>

      {/* Fußzeile mit Copyright-Informationen */}
      <footer className="f1-footer">
        <div>
          <p className="f1-footer-heading">F1 Championship</p>
          <p>Copyright 2025 F1 Championship. All rights reserved.</p>
        </div>
        <p className="f1-footer-meta">
          Made with passion by Ensar &amp; Stephanie
        </p>
      </footer>
    </div>
  );
};

export default Layout;
