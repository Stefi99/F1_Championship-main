package com.wiss.f1.championship.exception;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO für strukturierte Fehlerantworten.
 * Wird verwendet, um konsistente Fehlerinformationen an Clients zu senden.
 *
 * Enthält:
 * - timestamp: Zeitpunkt des Fehlers
 * - status: HTTP-Statuscode (z.B. 400, 404, 500)
 * - error: Kurze Fehlerbeschreibung
 * - message: Detaillierte Fehlermeldung
 * - validationErrors: Optional, enthält Feld-spezifische Validierungsfehler
 */
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private Map<String, String> validationErrors;

    public ErrorResponse() {
    }

    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
    }

    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message,
                         Map<String, String> validationErrors) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.validationErrors = validationErrors;
    }

    // Getter & Setter
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
   ZUSAMMENFASSUNG DES FILES (ErrorResponse.java)
   ------------------------------------------------------------
   - Standardisiertes DTO für Fehlerantworten
   - Unterstützt sowohl generische Fehler als auch Validierungsfehler
   - Dient zur konsistenten Kommunikation von Fehlern an Clients
   ============================================================ */
