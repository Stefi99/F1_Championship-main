package com.wiss.f1.championship.exception;

/**
 * Exception die geworfen wird, wenn die Anmeldedaten ungültig sind
 * (z.B. falsches Passwort oder Benutzer nicht gefunden).
 */
public class InvalidCredentialsException extends RuntimeException {
    
    public InvalidCredentialsException(String message) {
        super(message);
    }

    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
}

