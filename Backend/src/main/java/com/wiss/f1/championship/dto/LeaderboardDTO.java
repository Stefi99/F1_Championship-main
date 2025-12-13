package com.wiss.f1.championship.dto;

/**
 * DTO für Leaderboard-Einträge.
 *
 * Dient dazu, die Rangliste der Spieler im Frontend darzustellen.
 * Enthält:
 * - username: interner Benutzername
 * - displayName: Anzeigename des Users
 * - points: bisher erzielte Punkte
 * - rank: aktuelle Platzierung im Leaderboard
 */
public class LeaderboardDTO {

    private String username;       // Interner Benutzername
    private String displayName;    // Anzeigename, z.B. für UI
    private int points;            // Aktuelle Punktzahl des Users
    private int rank;              // Aktuelle Position im Leaderboard

    // Konstruktor
    public LeaderboardDTO(String username, String displayName, int points, int rank) {
        this.username = username;
        this.displayName = displayName;
        this.points = points;
        this.rank = rank;
    }

    // Getter und Setter
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (LeaderboardDTO.java)
   ------------------------------------------------------------
   - DTO für einzelne Leaderboard-Einträge
   - Enthält Benutzername, Anzeigename, Punkte und Rang
   - Wird vom LeaderboardController für API-Responses genutzt
   ============================================================ */
