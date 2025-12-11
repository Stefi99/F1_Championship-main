// zentrale Startseite für Administratoren
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredDrivers } from "../../data/drivers";
import { getAllRaces } from "../../services/raceService.js";
import driversImg from "../../assets/drivers.svg";
import raceImg from "../../assets/race.svg";
import resultsImg from "../../assets/results.svg";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ races: 0, drivers: 0, tasks: 0 });
  const [loading, setLoading] = useState(true);

  //Definiert alle Verwaltungsaktionen
  // wird als Klickbare Karte angezeigt
  const actions = [
    {
      label: "Rennen verwalten",
      description:
        "Bestehende Events prüfen, Status wechseln und Details anpassen.",
      title: "Geplante Rennen anzeigen und bearbeiten",
      img: raceImg,
      to: "/admin/races",
    },
    {
      label: "Fahrer verwalten",
      description:
        "Fahrerdaten und Team-Zuordnung pflegen - wirkt in allen Rennen.",
      title: "Fahrer- und Teamverwaltung öffnen",
      img: driversImg,
      to: "/admin/drivers",
    },
    {
      label: "Ergebnisse eintragen",
      description:
        "Rangfolge per Drag & Drop setzen, Punkte speichern und Rennen schließen.",
      title: "Offizielle Resultate erfassen",
      img: resultsImg,
      to: "/admin/results",
    },
  ];

  // Lädt aktuelle Statistikdaten vom Backend
  const refreshStats = useCallback(async () => {
    setLoading(true);
    try {
      const [racesData, driversData] = await Promise.all([
        getAllRaces(),
        getStoredDrivers(),
      ]);

      const openTasks = racesData.filter((race) => {
        const closed = race.status === "closed" || race.status === "CLOSED";
        const hasResults =
          Array.isArray(race.resultsOrder) && race.resultsOrder.length > 0;
        return !closed || !hasResults;
      }).length;

      setStats({
        races: racesData.length,
        drivers: driversData.length,
        tasks: openTasks,
      });
    } catch (error) {
      console.error("Fehler beim Laden der Statistiken:", error);
      setStats({ races: 0, drivers: 0, tasks: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Lädt Statistiken beim ersten Rendern
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Loading-State
  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <LoadingSpinner message="Statistiken werden geladen..." />
      </div>
    );
  }

  // Layout der Admin-Dashboard-Seite
  return (
    <div className="admin-dashboard-page">
      <header className="admin-dashboard-hero">
        <div>
          <p className="admin-eyebrow">Adminbereich</p>
          <h1>Formel 1 Steuerzentrale</h1>
          <p className="admin-sub">
            Schneller Überblick und direkte Shortcuts zu den wichtigsten Tasks.
          </p>
        </div>
        <div className="admin-hero-right">
          <div className="admin-hero-stats">
            <div className="admin-stat">
              <strong>{stats.races}</strong>
              <span>Rennen geplant</span>
            </div>
            <div className="admin-stat">
              <strong>{stats.drivers}</strong>
              <span>Fahrer gelistet</span>
            </div>
            <div className="admin-stat">
              <strong>{stats.tasks}</strong>
              <span>Offene Tasks</span>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-actions-grid">
        {actions.map((action) => (
          <button
            key={action.to}
            className="admin-action-card"
            onClick={() => navigate(action.to)}
            title={action.title}
            type="button"
          >
            <div className="admin-action-media">
              <img src={action.img} alt={action.label} />
            </div>
            <div className="admin-action-content">
              <h2>{action.label}</h2>
              <p>{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      <section className="admin-dashboard-foot">
        <div>
          <h3>Nächste Schritte</h3>
          <p>
            Neue Rennen anlegen, Fahrerkader pflegen oder Resultate direkt nach
            dem Wochenende eintragen. So bleibt die Saison immer aktuell.
          </p>
        </div>
        <div className="admin-foot-highlight">
          <p className="admin-eyebrow">Tipp</p>
          <p>
            Buttons sind klickbar, egal ob Bild oder Text - einfach loslegen.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;
