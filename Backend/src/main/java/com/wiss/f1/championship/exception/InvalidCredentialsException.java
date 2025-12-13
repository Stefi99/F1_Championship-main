package com.wiss.f1.championship.exception;

/**
 * Exception, die geworfen wird, wenn die Anmeldedaten ungültig sind
 * (z.B. falsches Passwort oder Benutzer nicht gefunden).
 *
 * Wird typischerweise während des Login-Prozesses verwendet.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }

    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
}

/*
 * Zusammenfassung:
 * Diese RuntimeException signalisiert, dass ein Benutzer
 * sich mit falschen Zugangsdaten anmelden wollte.
 * Sie wird im Authentifizierungsprozess genutzt, um
 * fehlerhafte Login-Versuche korrekt zu behandeln.
 */
