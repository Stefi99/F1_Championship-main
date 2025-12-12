package com.wiss.f1.championship.entity;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entity für einen User der Anwendung.
 * Implementiert Spring Security's UserDetails für Authentifizierung und Autorisierung.
 */
@Entity
@Table(name = "app_users")
public class AppUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primärschlüssel

    @Column(nullable = false, unique = true, length = 50)
    private String username;  // Username für Login

    @Column(nullable = false, unique = true, length = 100)
    private String email;  // E-Mail-Adresse

    @Column(nullable = false)
    private String password;  // Passwort (verschlüsselt)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;  // Rolle: PLAYER oder ADMIN

    @Column(length = 100)
    private String displayName;  // Optionaler Anzeigename

    @Column(length = 100)
    private String favoriteTeam;  // Optional: Lieblings-Team

    @Column(length = 100)
    private String country;      // Optional: Land

    @Column(length = 500)
    private String bio;          // Optional: Biografie

    // Standardkonstruktor
    public AppUser() {}

    // Konstruktor ohne displayName (displayName = username)
    public AppUser(String username, String email, String password, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.displayName = username;
    }

    // Konstruktor mit optionalem displayName
    public AppUser(String username, String email, String password, Role role, String displayName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.displayName = displayName != null && !displayName.trim().isEmpty() ? displayName : username;
    }

    // UserDetails Methoden für Spring Security
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return username; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    public Long getId() { return id; }

    public String getEmail() { return email; }

    public Role getRole() { return role; }

    public void setRole(Role role) { this.role = role; }

    public String getDisplayName() {
        return displayName != null && !displayName.trim().isEmpty() ? displayName : username;
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
   ZUSAMMENFASSUNG DIESES FILES (AppUser.java)
   ------------------------------------------------------------
   - Entity für User, speichert Username, Email, Passwort, Rolle
   - Optionale Felder: displayName, favoriteTeam, country, bio
   - Implementiert UserDetails für Spring Security:
       - getAuthorities() gibt ROLE_PLAYER oder ROLE_ADMIN zurück
       - AccountStatus-Methoden immer true (nicht gesperrt/abgelaufen)
   - Wird in AuthController, AppUserController und SecurityConfig verwendet
   ============================================================ */
