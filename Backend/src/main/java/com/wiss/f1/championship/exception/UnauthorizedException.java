package com.wiss.f1.championship.exception;

/**
 * Exception die geworfen wird, wenn ein Benutzer nicht berechtigt ist,
 * eine bestimmte Aktion auszuführen (z.B. fehlende Berechtigung).
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}

