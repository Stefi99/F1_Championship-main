package com.wiss.f1.championship.exception;

public class RaceNotFoundException extends RuntimeException {
    
    public RaceNotFoundException(String message) {
        super(message);
    }
    
    public RaceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

