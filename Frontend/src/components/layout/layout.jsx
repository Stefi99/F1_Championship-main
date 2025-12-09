import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

// Globales Seitenlayout.
// Enthält die Navigationsleiste, den Platzhalter für Seiteninhalte (Outlet)
// sowie den Footer. Dieses Layout wird um alle Hauptseiten herum verwendet.
const Layout = () => {
  return (
    <div className="f1-shell">
      <Navbar />

      <main className="f1-main">
        <Outlet />
      </main>

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
