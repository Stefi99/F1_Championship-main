package com.wiss.f1.championship.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.repository.AppUserRepository;

/**
 * Service-Klasse für die Verwaltung von AppUser-Entitäten.
 *
 * Verantwortlich für:
 * - Benutzerregistrierung
 * - Authentifizierung
 * - Abruf von Benutzerdaten
 * - Profilaktualisierung
 *
 * Nutzt AppUserRepository für DB-Zugriffe und PasswordEncoder für sichere Passwort-Hashes.
 */
@Service
public class AppUserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserService(AppUserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Sucht einen Benutzer anhand der ID.
     * @param id Benutzer-ID
     * @return Optional<AppUser>
     */
    public Optional<AppUser> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Sucht einen Benutzer anhand des Benutzernamens.
     * @param username Benutzername
     * @return Optional<AppUser>
     */
    public Optional<AppUser> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Sucht einen Benutzer anhand der E-Mail-Adresse.
     * @param email E-Mail-Adresse
     * @return Optional<AppUser>
     */
    public Optional<AppUser> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Sucht einen Benutzer anhand eines Identifiers, der entweder Username oder Email sein kann.
     * @param identifier Username oder Email
     * @return Optional<AppUser>
     */
    public Optional<AppUser> getUserByIdentifier(String identifier) {
        Optional<AppUser> userByEmail = userRepository.findByEmail(identifier);
        if (userByEmail.isPresent()) {
            return userByEmail;
        }
        return userRepository.findByUsername(identifier);
    }

    /**
     * Registriert einen neuen Benutzer mit Pflichtfeldern.
     * @param username Benutzername
     * @param email E-Mail-Adresse
     * @param rawPassword Klartext-Passwort
     * @param role Rolle des Benutzers
     * @return Gespeicherter Benutzer
     * @throws IllegalArgumentException wenn Username oder Email bereits existiert
     */
    public AppUser registerUser(String username, String email, String rawPassword, Role role) {
        return registerUser(username, email, rawPassword, role, null);
    }

    /**
     * Registriert einen neuen Benutzer mit optionalem Anzeigenamen.
     * @param username Benutzername
     * @param email E-Mail-Adresse
     * @param rawPassword Klartext-Passwort
     * @param role Rolle des Benutzers
     * @param displayName Optionaler Anzeigename
     * @return Gespeicherter Benutzer
     */
    public AppUser registerUser(String username, String email, String rawPassword, Role role, String displayName) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(rawPassword);

        AppUser user = new AppUser(username, email, hashedPassword, role, displayName);
        return userRepository.save(user);
    }

    /**
     * Authentifiziert einen Benutzer anhand von Username/Email und Passwort.
     * @param identifier Username oder Email
     * @param rawPassword Klartext-Passwort
     * @return Authentifizierter Benutzer
     * @throws IllegalArgumentException wenn Benutzer nicht gefunden oder Passwort falsch
     */
    public AppUser authenticate(String identifier, String rawPassword) {
        AppUser user = getUserByIdentifier(identifier)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return user;
    }

    /**
     * Aktualisiert die Profilinformationen eines Benutzers.
     * Leere Strings werden als null behandelt.
     * @param user Benutzerobjekt
     * @param displayName Neuer Anzeigename (optional)
     * @param favoriteTeam Neues Lieblings-Team (optional)
     * @param country Neues Land (optional)
     * @param bio Neue Biografie (optional)
     * @return Aktualisierter Benutzer
     */
    public AppUser updateUserProfile(AppUser user, String displayName, String favoriteTeam, String country, String bio) {
        if (displayName != null && !displayName.trim().isEmpty()) {
            user.setDisplayName(displayName);
        }

        if (favoriteTeam != null) {
            user.setFavoriteTeam(favoriteTeam.trim().isEmpty() ? null : favoriteTeam);
        }

        if (country != null) {
            user.setCountry(country.trim().isEmpty() ? null : country);
        }

        if (bio != null) {
            user.setBio(bio.trim().isEmpty() ? null : bio);
        }

        return userRepository.save(user);
    }
}

/*
 * Zusammenfassung:
 * AppUserService ist die zentrale Service-Klasse für Benutzerverwaltung.
 * Sie übernimmt:
 * - Registrierung von Benutzern mit Passwort-Hashing
 * - Authentifizierung via Username/Email + Passwort
 * - Abruf von Benutzern per ID, Username oder Email
 * - Aktualisierung von optionalen Profilfeldern
 *
 * Diese Klasse kapselt Repository-Zugriffe und sorgt für Business-Logik wie Passwortprüfung
 * und Validierung von eindeutigen Benutzernamen/Emails.
 */
