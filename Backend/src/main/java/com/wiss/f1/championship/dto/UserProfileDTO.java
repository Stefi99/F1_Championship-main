package com.wiss.f1.championship.dto;

/**
 * DTO für die Darstellung des vollständigen User-Profils.
 *
 * Wird verwendet, um Profilinformationen an den Client zu senden,
 * z.B. über GET /api/users/me im AppUserController.
 */
public class UserProfileDTO {

    private String username;        // Username des Users
    private String displayName;     // Anzeigename
    private String email;           // E-Mail-Adresse
    private String favoriteTeam;    // Optional: Lieblings-Team
    private String country;         // Optional: Land
    private String bio;             // Optional: Biografie
    private int points;             // Gesamtpunkte des Users (berechnet aus LeaderboardService)
    private String role;            // Rolle des Users (PLAYER oder ADMIN)

    // Standardkonstruktor
    public UserProfileDTO() {
    }

    // Konstruktor mit allen Feldern
    public UserProfileDTO(String username, String displayName, String email,
                          String favoriteTeam, String country, String bio,
                          int points, String role) {
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.favoriteTeam = favoriteTeam;
        this.country = country;
        this.bio = bio;
        this.points = points;
        this.role = role;
    }

    // Getter und Setter

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFavoriteTeam() {
        return favoriteTeam;
    }

    public void setFavoriteTeam(String favoriteTeam) {
        this.favoriteTeam = favoriteTeam;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (UserProfileDTO.java)
   ------------------------------------------------------------
   - DTO für das vollständige Profil eines Users
   - Enthält Username, DisplayName, Email, FavoriteTeam, Country, Bio
     sowie Punkte und Rolle
   - Wird im AppUserController für GET /api/users/me zurückgegeben
   - Punkte werden aus dem LeaderboardService berechnet
   ============================================================ */
