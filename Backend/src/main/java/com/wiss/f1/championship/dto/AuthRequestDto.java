package com.wiss.f1.championship.dto;

public class AuthRequestDto {

    private String username;
    private String password;

    // Leerer Konstruktor für JSON (z. B. Insomnia, Frontend)
    public AuthRequestDto() {
    }

    public AuthRequestDto(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getter & Setter

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

