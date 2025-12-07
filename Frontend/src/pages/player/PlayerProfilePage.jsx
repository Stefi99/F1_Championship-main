import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.js";
import { TEAM_OPTIONS } from "../../data/drivers";
import { loadPlayerProfile, persistPlayerProfile } from "../../utils/profile";

function PlayerProfilePage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => loadPlayerProfile());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState(() => ({
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(loadPlayerProfile());
  }, [user]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "playerProfile" || event.key === null) {
        setProfile(loadPlayerProfile());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
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

  const formatDateTime = (value, fallback = "Noch nie aktualisiert") => {
    if (!value) return fallback;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleString("de-DE");
  };

  const lastUpdateText = useMemo(
    () => formatDateTime(profile.lastUpdated),
    [profile.lastUpdated]
  );

  const passwordInfo = useMemo(
    () =>
      profile.lastPasswordChange
        ? `Zuletzt geaendert am ${formatDateTime(profile.lastPasswordChange)}`
        : "Noch kein Passwort gesetzt",
    [profile.lastPasswordChange]
  );

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.displayName.trim() || !form.email.trim() || !form.username.trim()) {
      setError("Anzeigename, E-Mail und Benutzername sind Pflichtfelder.");
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwoerter stimmen nicht ueberein.");
      return;
    }

    const updates = {
      ...profile,
      displayName: form.displayName.trim() || profile.displayName,
      email: form.email.trim() || profile.email,
      username: form.username.trim() || profile.username,
      favoriteTeam: form.favoriteTeam.trim(),
      country: form.country.trim(),
      bio: form.bio.trim(),
      points: Number.isNaN(Number(form.points)) ? profile.points || 0 : Number(form.points),
    };

    if (form.password) {
      updates.password = form.password;
      updates.lastPasswordChange = new Date().toISOString();
    }

    const saved = persistPlayerProfile(updates);
    login(saved);
    setProfile(saved);
    setMessage("Profil gespeichert.");
  };

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
            <span className="player-badge muted">Letztes Update: {lastUpdateText}</span>
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
                Diese Daten nutzen wir fuer den Spielerbereich und die Leaderboard-Anzeige.
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
                onChange={handleChange("email")}
                placeholder="player@example.com"
                required
              />
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Benutzername</span>
              <input
                type="text"
                value={form.username}
                onChange={handleChange("username")}
                placeholder="player"
                required
              />
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Aktuelle Punkte</span>
              <input
                type="number"
                min="0"
                value={form.points}
                onChange={handleChange("points")}
                placeholder="0"
              />
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Lieblingsteam</span>
              <select
                value={form.favoriteTeam}
                onChange={handleChange("favoriteTeam")}
              >
                <option value="">Bitte waehlen...</option>
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
                Neues Passwort setzen, um deine Tipps zu schuetzen. Wird lokal gespeichert.
              </p>
            </div>
          </div>

          <div className="player-profile-grid">
            <label className="player-field-card">
              <span className="player-field-label">Neues Passwort (optional)</span>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
              />
            </label>

            <label className="player-field-card">
              <span className="player-field-label">Passwort bestaetigen</span>
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
          <button type="submit">Speichern</button>
          <button
            type="button"
            className="player-ghost-btn"
            onClick={() => navigate("/player")}
          >
            Zurueck zum Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlayerProfilePage;
