package com.wiss.f1.championship.dto;

public class UpdateProfileDTO {

    private String displayName;
    private String favoriteTeam;
    private String country;
    private String bio;

    public UpdateProfileDTO() {
    }

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

