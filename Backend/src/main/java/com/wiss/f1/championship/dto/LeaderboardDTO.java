
package com.wiss.f1.championship.dto;

public class LeaderboardDTO {
    private String username;
    private String displayName;
    private int points;
    private int rank;

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