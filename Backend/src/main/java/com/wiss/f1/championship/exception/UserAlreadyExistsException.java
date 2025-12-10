package com.wiss.f1.championship.exception;

/**
 * Exception die geworfen wird, wenn ein Benutzer bereits existiert
 * (z.B. Username oder Email bereits vergeben).
 */
public class UserAlreadyExistsException extends RuntimeException {
    
    public UserAlreadyExistsException(String message) {
        super(message);
    }

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}

