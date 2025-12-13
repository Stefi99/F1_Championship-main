package com.wiss.f1.championship.dto;

/**
 * DTO für die Aktualisierung des User-Profils.
 *
 * Wird im AppUserController für PUT /api/users/me verwendet,
 * um vom Client übermittelte Profilfelder zu empfangen.
 */
public class UpdateProfileDTO {

    private String displayName;   // Neuer Anzeigename des Users
    private String favoriteTeam;  // Neues Lieblingsteam
    private String country;       // Neues Land des Users
    private String bio;           // Neue Biografie oder Beschreibung

    // Standardkonstruktor
    public UpdateProfileDTO() {
    }

    // Konstruktor mit allen Feldern
    public UpdateProfileDTO(String displayName, String favoriteTeam, String country, String bio) {
        this.displayName = displayName;
        this.favoriteTeam = favoriteTeam;
        this.country = country;
        this.bio = bio;
    }

    // Getter und Setter

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
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
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (UpdateProfileDTO.java)
   ------------------------------------------------------------
   - DTO für Profilaktualisierungen eines Users
   - Enthält: displayName, favoriteTeam, country, bio
   - Wird im AppUserController für PUT /api/users/me verwendet
   ============================================================ */
