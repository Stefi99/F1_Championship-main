package com.wiss.f1.championship.dto;

/**
 * DTO für Authentifizierungs-Antworten (Response)
 *
 * Wird zurückgegeben nach erfolgreichem Login oder Registrierung.
 * Enthält User-Infos und JWT-Token.
 */
public class AuthResponseDTO {

    private Long id;          // ID des Benutzers
    private String username;  // Username des Benutzers
    private String role;      // Rolle des Benutzers (z.B. PLAYER, ADMIN)
    private String token;     // JWT-Token für Autorisierung

    // Leerer Konstruktor für Frameworks / Serialisierung
    public AuthResponseDTO() {
    }

    // Konstruktor für schnelle Erstellung der Response
    public AuthResponseDTO(Long id, String username, String role, String token) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.token = token;
    }

    // Getter und Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (AuthResponseDTO.java)
   ------------------------------------------------------------
   - Response-DTO für Authentifizierung (Login/Registration).
   - Enthält: User-ID, Username, Rolle und JWT-Token.
   - Wird vom AuthController zurückgegeben.
   ============================================================ */
