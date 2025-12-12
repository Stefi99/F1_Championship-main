package com.wiss.f1.championship.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.wiss.f1.championship.dto.AuthRequestDTO;
import com.wiss.f1.championship.dto.AuthResponseDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.security.JwtService;
import com.wiss.f1.championship.service.AppUserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Service für User-Registrierung / Login
    private final AppUserService userService;

    // Service zum Erstellen und Prüfen von JWT-Tokens
    private final JwtService jwtService;

    public AuthController(AppUserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    /**
     * Registriert einen neuen Benutzer.
     * Standardrolle ist PLAYER, falls nicht im Request gesetzt.
     * Nach erfolgreicher Registrierung wird ein JWT generiert.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody AuthRequestDTO request) {
        try {
            // Standardrolle
            Role role = Role.PLAYER;

            // Falls vom User eine Rolle angegeben wurde (z. B. ADMIN)
            if (request.getRole() != null) {
                role = Role.valueOf(request.getRole().toUpperCase());
            }

            // User anlegen
            AppUser user = userService.registerUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    role,
                    request.getDisplayName()
            );

            // JWT erstellen
            String token = jwtService.generateToken(user);

            // Erfolgsantwort senden
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponseDTO(user.getId(), user.getUsername(), user.getRole().name(), token));

        } catch (Exception ex) {
            // Allgemeiner Fehler (z. B. Username existiert schon)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponseDTO(null, null, null, "ERROR: " + ex.getMessage()));
        }
    }

    /**
     * Loggt einen Benutzer ein.
     * Es kann entweder Username oder Email als identifier verwendet werden.
     * Bei Erfolg wird ein JWT zurückgegeben.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        try {
            // Username oder Email identifizieren
            String identifier = request.getIdentifier();

            // Rückwärtskompatibilität: Falls identifier fehlt, Username verwenden
            if (identifier == null || identifier.trim().isEmpty()) {
                identifier = request.getUsername();
            }

            // Falls immer noch leer -> Fehler
            if (identifier == null || identifier.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthResponseDTO(null, null, null, "ERROR: identifier or username required"));
            }

            // User authentifizieren
            AppUser user = userService.authenticate(
                    identifier.trim(),
                    request.getPassword()
            );

            // JWT erstellen
            String token = jwtService.generateToken(user);

            // Erfolgreiche Login-Antwort
            return ResponseEntity.ok(
                    new AuthResponseDTO(user.getId(), user.getUsername(), user.getRole().name(), token)
            );

        } catch (Exception ex) {
            // Fehlerhafte Login-Daten
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO(null, null, null, "ERROR: " + ex.getMessage()));
        }
    }
}


/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (AuthController.java)
   ------------------------------------------------------------
   - Verwaltet Registrierung und Login der Benutzer.
   - POST /api/auth/register:
       * Legt neuen User an.
       * Standardrolle: PLAYER.
       * Gibt direkt ein JWT-Token zurück.
   - POST /api/auth/login:
       * Login mit Username oder Email.
       * Prüft Login-Daten.
       * Gibt bei Erfolg JWT zurück.
   - Fehler werden als einfache Fehlermeldungen im DTO zurückgegeben.
   ============================================================ */
