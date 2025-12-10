package com.wiss.f1.championship.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.wiss.f1.championship.entity.AppUser;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(@Value("${jwt.secret:}") String secret) {
        // Prüfe ob das Secret gesetzt ist
        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalArgumentException(
                "JWT_SECRET Environment Variable ist nicht gesetzt! " +
                "Bitte setze die Environment Variable JWT_SECRET mit einem Wert von mindestens 32 Zeichen."
            );
        }
        
        // Konvertiere den String in einen SecretKey
        // Für HS256 benötigen wir mindestens 256 Bit (32 Bytes)
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        
        // Stelle sicher, dass der Key mindestens 32 Bytes lang ist
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException(
                "JWT Secret muss mindestens 32 Bytes (256 Bit) lang sein für HS256. " +
                "Aktuelle Länge: " + keyBytes.length + " Bytes"
            );
        }
        
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(AppUser user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(secretKey)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
