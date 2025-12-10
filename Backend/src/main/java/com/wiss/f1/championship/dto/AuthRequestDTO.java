package com.wiss.f1.championship.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthRequestDTO {

    @Email(message = "Email muss eine gültige E-Mail-Adresse sein")
    @Size(max = 100, message = "Email darf maximal 100 Zeichen lang sein")
    // @NotBlank wird im Controller geprüft, da email nur für Register benötigt wird
    private String email;

    @Size(min = 3, max = 50, message = "Username muss zwischen 3 und 50 Zeichen lang sein")
    // @NotBlank wird im Controller geprüft, da username nur für Register benötigt wird
    private String username;

    @Size(max = 100, message = "Identifier darf maximal 100 Zeichen lang sein")
    private String identifier;  // Für Login: kann Email oder Username sein

    @Size(max = 100, message = "DisplayName darf maximal 100 Zeichen lang sein")
    private String displayName;  // Für Registrierung: Anzeigename

    @NotBlank(message = "Passwort ist erforderlich")
    @Size(min = 6, max = 100, message = "Passwort muss zwischen 6 und 100 Zeichen lang sein")
    private String password;

    private String role;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
