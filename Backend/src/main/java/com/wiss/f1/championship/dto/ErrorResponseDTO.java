package com.wiss.f1.championship.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standardisiertes DTO für Fehlerantworten.
 *
 * Wird verwendet, um konsistente Fehlerinformationen an Clients zu senden.
 * Enthält:
 * - timestamp: Zeitpunkt des Fehlers
 * - status: HTTP-Statuscode
 * - error: Kurzbeschreibung des Fehlers
 * - message: Detailnachricht
 * - validationErrors: Optional, enthält Feld-Validierungsfehler
 */
public class ErrorResponseDTO {

    private LocalDateTime timestamp;            // Zeitpunkt der Fehlererstellung
    private int status;                          // HTTP-Statuscode (z.B. 400, 404)
    private String error;                        // Kurze Fehlerbeschreibung
    private String message;                      // Detaillierte Fehlermeldung
    private Map<String, String> validationErrors; // Optional: Validierungsfehler pro Feld

    // Leerer Konstruktor für Serialisierung / Frameworks
    public ErrorResponseDTO() {
    }

    // Konstruktor ohne Validierungsfehler
    public ErrorResponseDTO(LocalDateTime timestamp, int status, String error, String message) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
    }

    // Konstruktor mit Validierungsfehlern
    public ErrorResponseDTO(LocalDateTime timestamp, int status, String error, String message,
                            Map<String, String> validationErrors) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.validationErrors = validationErrors;
    }

    // Getter und Setter
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Map<String, String> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(Map<String, String> validationErrors) { this.validationErrors = validationErrors; }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (ErrorResponseDTO.java)
   ------------------------------------------------------------
   - DTO für standardisierte Fehlerantworten
   - Enthält HTTP-Status, Fehlerbeschreibung, Nachricht, Timestamp
   - Optional: Validierungsfehler (z.B. Feld-spezifische Fehlermeldungen)
   - Dient für konsistente Fehlerkommunikation an Clients
   ============================================================ */
