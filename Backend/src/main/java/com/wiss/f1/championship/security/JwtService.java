package com.wiss.f1.championship.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.wiss.f1.championship.entity.AppUser;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * Service zur Verwaltung von JWTs (JSON Web Tokens).
 *
 * Funktionen:
 * - Generierung von JWTs für authentifizierte Benutzer
 * - Extraktion von Claims aus einem JWT
 */
@Service
public class JwtService {

    // Secret-Key aus application.properties
    @Value("${jwt.secret}")
    private String secret;

    /**
     * Erzeugt den Schlüssel zur Signatur der Tokens.
     * @return Key-Objekt für HS256 Signatur
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generiert ein JWT für einen gegebenen Benutzer.
     * @param user Benutzer, für den das Token erstellt wird
     * @return signiertes JWT als String
     */
    public String generateToken(AppUser user) {
        return Jwts.builder()
                .setSubject(user.getUsername())            // Benutzername als Subject
                .claim("role", user.getRole().name())     // Rolle als Claim
                .setIssuedAt(new Date())                  // Erstellungszeitpunkt
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // Ablauf: 24h
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Signatur
                .compact();
    }

    /**
     * Extrahiert Claims (z.B. username, role) aus einem JWT.
     * @param token JWT-String
     * @return Claims-Objekt
     */
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Signaturschlüssel
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

/*
 * Zusammenfassung:
 * JwtService verwaltet die Erstellung und Auswertung von JSON Web Tokens.
 * Tokens enthalten Username und Rolle des Benutzers, werden mit HS256 signiert
 * und sind 24 Stunden gültig. Die extractClaims-Methode ermöglicht es,
 * Daten aus einem vorhandenen Token zu lesen (z.B. zur Authentifizierung in Filtern).
 */
