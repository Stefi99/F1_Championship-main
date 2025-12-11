// Seite zur Bearbeitung des persönlichen Spielerprofils.
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";
import { TEAM_OPTIONS } from "../../data/drivers";
import { loadPlayerProfile, persistPlayerProfile } from "../../utils/profile";
import { ApiError } from "../../utils/api.js";

function PlayerProfilePage() {
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Initialisiert das Formular mit den aktuellen Profildaten.
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    username: "",
    favoriteTeam: "",
    country: "",
    bio: "",
    points: 0,
    password: "",
    confirmPassword: "",
  });

  // Lädt Profil vom Backend beim Komponenten-Mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const profileData = await loadPlayerProfile();
        setProfile(profileData);
        setForm({
          displayName: profileData.displayName || "",
          email: profileData.email || "",
          username: profileData.username || "",
          favoriteTeam: profileData.favoriteTeam || "",
          country: profileData.country || "",
          bio: profileData.bio || "",
          points: profileData.points ?? 0,
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
        setError("Profil konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Übernimmt neue Profildaten ins Formular,
  // ohne Passwortfelder zu verändern.
  useEffect(() => {
    // Daten nicht setzen falls profil nicht vorhanden (Loading state)
    if (profile == null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((prev) => ({
      ...prev,
      displayName: profile.displayName || "",
      email: profile.email || "",
      username: profile.username || "",
      favoriteTeam: profile.favoriteTeam || "",
      country: profile.country || "",
      bio: profile.bio || "",
      points: profile.points ?? 0,
      password: "",
      confirmPassword: "",
    }));
  }, [profile]);

  // Hilfsfunktion zur Ausgabe eines formatierten Zeitpunkts,
  // mit optionalem Fallback für leere oder ungültige Werte.
  const formatDateTime = (value, fallback = "Noch nie aktualisiert") => {
    if (!value) return fallback;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleString("de-DE");
  };

  // Memoisierte Textversionen für Anzeige im Header
  const lastUpdateText = useMemo(
    () => formatDateTime(profile?.lastUpdated),
    [profile?.lastUpdated]
  );

  const passwordInfo = useMemo(
    () =>
      profile?.lastPasswordChange
        ? `Zuletzt geändert am ${formatDateTime(profile.lastPasswordChange)}`
        : "Passwort kann nicht hier geändert werden",
    [profile?.lastPasswordChange]
  );

  // Loading-State
  if (loading) {
    return (
      <div className="player-profile-page">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Profil wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="player-profile-page">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Kein Profil gefunden. Bitte melde dich an.</p>
        </div>
      </div>
    );
  }

  // Generische Feld-Update-Funktion für das Formular
  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validiert und speichert das Profil
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    // Validierung
    if (!form.displayName.trim()) {
      setError("Anzeigename ist ein Pflichtfeld.");
      setSaving(false);
      return;
    }

    // HINWEIS: Email, Username und Passwort können nicht über /api/users/me geändert werden
    // Diese Felder werden nur angezeigt, aber nicht gespeichert
    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      setSaving(false);
      return;
    }

    try {
      // Nur die Felder, die das Backend akzeptiert
      const updates = {
        displayName: form.displayName.trim(),
        favoriteTeam: form.favoriteTeam.trim() || "Keines",
        country: form.country.trim(),
        bio: form.bio.trim(),
        // Punkte werden vom Backend berechnet, nicht manuell gesetzt
        points: profile?.points || 0,
      };

      // API-Call zum Backend
      const saved = await persistPlayerProfile(updates);

      // Profil im lokalen State aktualisieren
      setProfile(saved);

      // AuthContext aktualisieren, damit die neuen Daten überall verfügbar sind
      await refreshUser();

      setMessage("Profil erfolgreich gespeichert.");
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message || "Fehler beim Speichern des Profils.");
      } else {
        setError("Ein unerwarteter Fehler ist aufgetreten.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Darstellung des Profilbearbeitungsformulars
  return (
    <div className="player-profile-page">
      <header className="player-profile-hero">
        <div>
          <p className="player-eyebrow">Profil bearbeiten</p>
          <h1>Deine Daten anpassen</h1>
          <p className="player-sub">
            Name, Login-Daten und Favoriten im gleichen Stil wie Dashboard und
            Admin-Bereich pflegen.
          </p>
          <div className="player-profile-meta">
            <span className="player-badge">User: {profile.username}</span>
            <span className="player-badge muted">
              Letztes Update: {lastUpdateText}
            </span>
            <span className="player-badge accent">{passwordInfo}</span>
          </div>
        </div>
      </header>

      <form className="player-profile-shell" onSubmit={handleSubmit}>
        <section className="player-profile-section">
          <div className="player-profile-section-head">
            <div>
              <p className="player-eyebrow">Basisdaten</p>
              <h2>Kontakt und Anzeigename</h2>
              <p className="player-sub">
                Diese Daten nutzen wir für den Spielerbereich und die
                Leaderboard-Anzeige.
              </p>
            </div>
          </div>

          <div className="player-profile-grid">
            <label className="player-field-card">
              <span className="player-field-label">Anzeigename</span>
              <input
                type="text"
                value={form.displayName}
                onChange={handleChange("displayName")}
                placeholder="z. B. Speedster Max"
                required
              />
            </label>

            <label className="player-field-card">
              <span className="player-field-label">E-Mail</span>
              <input
                type="email"
                value={form.email}
                disabled
                placeholder="player@example.com"
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
              <small style={{ fontSize: "0.875rem", color: "#888" }}>
                E-Mail kann nicht geändert werden
              </small>
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Benutzername</span>
              <input
                type="text"
                value={form.username}
                disabled
                placeholder="player"
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
              <small style={{ fontSize: "0.875rem", color: "#888" }}>
                Benutzername kann nicht geändert werden
              </small>
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Aktuelle Punkte</span>
              <input
                type="number"
                min="0"
                value={form.points}
                disabled
                placeholder="0"
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
              <small style={{ fontSize: "0.875rem", color: "#888" }}>
                Punkte werden automatisch berechnet
              </small>
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Lieblingsteam</span>
              <select
                value={form.favoriteTeam}
                onChange={handleChange("favoriteTeam")}
              >
                <option value="">Bitte wählen...</option>
                <option value="Keines">Kein Favorit</option>
                {TEAM_OPTIONS.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Land</span>
              <input
                type="text"
                value={form.country}
                onChange={handleChange("country")}
                placeholder="Schweiz"
              />
            </label>

            <label className="player-field-card wide">
              <span className="player-field-label">Kurzprofil</span>
              <textarea
                rows={3}
                value={form.bio}
                onChange={handleChange("bio")}
                placeholder="Lieblingsstrecken, Motivation oder eigene Notiz."
              />
            </label>
          </div>
        </section>

        <section className="player-profile-section">
          <div className="player-profile-section-head">
            <div>
              <p className="player-eyebrow">Login</p>
              <h2>Passwort anpassen</h2>
              <p className="player-sub">
                Passwort-Änderung ist aktuell nicht über dieses Formular
                möglich.
              </p>
            </div>
          </div>

          <div className="player-profile-grid">
            <label className="player-field-card">
              <span className="player-field-label">
                Neues Passwort (optional)
              </span>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
              />
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Passwort bestätigen</span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="Nochmals eingeben"
              />
            </label>
          </div>
        </section>

        {(message || error) && (
          <div className={`player-alert ${error ? "is-error" : "is-success"}`}>
            {error || message}
          </div>
        )}

        <div className="player-profile-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Wird gespeichert..." : "Speichern"}
          </button>
          <button
            type="button"
            className="player-ghost-btn"
            onClick={() => navigate("/player")}
          >
            Zurück zum Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlayerProfilePage;
