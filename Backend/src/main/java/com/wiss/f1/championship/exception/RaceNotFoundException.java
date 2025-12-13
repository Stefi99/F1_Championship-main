package com.wiss.f1.championship.exception;

/**
 * Exception, die geworfen wird, wenn ein Rennen nicht gefunden wird.
 *
 * Typischerweise verwendet in Services oder Controllern,
 * wenn eine Race-ID ungültig ist oder das Rennen nicht existiert.
 */
public class RaceNotFoundException extends RuntimeException {

    public RaceNotFoundException(String message) {
        super(message);
    }

    public RaceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

/*
 * Zusammenfassung:
 * Diese RuntimeException signalisiert, dass auf ein Rennen
 * zugegriffen wurde, das nicht existiert.
 * Sie dient der konsistenten Fehlerbehandlung bei fehlenden Rennen.
 */
