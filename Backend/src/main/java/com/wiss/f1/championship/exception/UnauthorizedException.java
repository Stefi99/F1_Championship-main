package com.wiss.f1.championship.exception;

/**
 * Exception, die geworfen wird, wenn ein Benutzer nicht berechtigt ist,
 * eine bestimmte Aktion auszuführen (z.B. fehlende Admin- oder Owner-Rechte).
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}

/*
 * Zusammenfassung:
 * Diese RuntimeException signalisiert, dass ein Benutzer
 * versucht hat, eine Aktion auszuführen, für die er keine Berechtigung hat.
 * Sie wird typischerweise für Zugriffskontrolle und Sicherheitsprüfungen verwendet.
 */
