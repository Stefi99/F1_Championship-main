package com.wiss.f1.championship.exception;

/**
 * Exception, die geworfen wird, wenn ein Benutzer nicht gefunden wird.
 * Wird z.B. verwendet, wenn eine Benutzer-ID oder ein Username nicht existiert.
 */
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

/*
 * Zusammenfassung:
 * Diese RuntimeException signalisiert, dass die angeforderte Benutzerressource
 * nicht existiert oder nicht gefunden werden konnte. Wird typischerweise in
 * Service- oder Controller-Methoden genutzt, um 404-Fehler zu erzeugen.
 */
