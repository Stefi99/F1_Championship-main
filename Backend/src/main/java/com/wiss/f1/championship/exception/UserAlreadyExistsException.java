package com.wiss.f1.championship.exception;

/**
 * Exception, die geworfen wird, wenn ein Benutzer bereits existiert
 * (z.B. Username oder Email schon vergeben).
 */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}

/*
 * Zusammenfassung:
 * Diese RuntimeException wird verwendet, um anzuzeigen,
 * dass bei der Registrierung eines Benutzers ein Konflikt
 * aufgrund bereits existierender Daten (Username/Email) aufgetreten ist.
 */
