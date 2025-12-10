package com.wiss.f1.championship.exception;

/**
 * Exception die geworfen wird, wenn ein Benutzer nicht gefunden wird.
 */
public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

