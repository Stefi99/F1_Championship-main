package com.wiss.f1.championship.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Globaler Exception Handler für die gesamte Anwendung.
 *
 * Verantwortlich für:
 * - Zentrale Fehlerbehandlung für alle Controller
 * - Strukturierte Fehlerantworten an die Clients
 * - Unterscheidung verschiedener Exception-Typen
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Behandelt UserNotFoundException.
     * Wird geworfen, wenn ein Benutzer nicht gefunden wird.
     * Response: 404 NOT FOUND
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),                   // Zeit des Fehlers
                HttpStatus.NOT_FOUND.value(),          // HTTP Statuscode 404
                "User Not Found",                      // Kurze Fehlerbeschreibung
                ex.getMessage()                        // Detaillierte Fehlermeldung
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * Behandelt InvalidCredentialsException.
     * Wird geworfen, wenn Login-Daten ungültig sind.
     * Response: 401 UNAUTHORIZED
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "Invalid Credentials",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    /**
     * Behandelt UserAlreadyExistsException.
     * Wird geworfen, wenn ein Benutzer bereits existiert.
     * Response: 409 CONFLICT
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "User Already Exists",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    /**
     * Behandelt UnauthorizedException.
     * Wird geworfen, wenn ein Benutzer nicht berechtigt ist, eine Aktion auszuführen.
     * Response: 403 FORBIDDEN
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.FORBIDDEN.value(),
                "Forbidden",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    /**
     * Behandelt RaceNotFoundException.
     * Wird geworfen, wenn ein Rennen nicht gefunden wird.
     * Response: 404 NOT FOUND
     */
    @ExceptionHandler(RaceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRaceNotFoundException(RaceNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Race Not Found",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * Behandelt allgemeine IllegalArgumentExceptions.
     * Z.B. für Business-Logic-Fehler oder ungültige Argumente.
     * Response: 400 BAD REQUEST
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Behandelt Validierungsfehler (@Valid Annotation).
     * Extrahiert alle Feld-Fehler und gibt sie strukturiert zurück.
     * Response: 400 BAD REQUEST
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> validationErrors = new HashMap<>();

        // Alle Validierungsfehler durchlaufen
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField(); // Feldname
            String errorMessage = error.getDefaultMessage();    // Fehlermeldung
            validationErrors.put(fieldName, errorMessage);
        });

        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "Die Anfrage enthält ungültige Daten",
                validationErrors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Fallback-Handler für alle anderen unerwarteten Exceptions.
     * Response: 500 INTERNAL SERVER ERROR
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Ein unerwarteter Fehler ist aufgetreten: " + ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /*
     * Zusammenfassung:
     * -----------------
     * 1. Zentralisierte Fehlerbehandlung für alle Controller durch @RestControllerAdvice.
     * 2. Liefert strukturierte Fehlerantworten (ErrorResponse) an Clients.
     * 3. Unterscheidet verschiedene Fehlerarten:
     *    - Benutzerbezogen: UserNotFoundException, UserAlreadyExistsException
     *    - Authentifizierung: InvalidCredentialsException, UnauthorizedException
     *    - Rennen-bezogen: RaceNotFoundException
     *    - Validierung: MethodArgumentNotValidException
     *    - Allgemeine Argumentfehler: IllegalArgumentException
     *    - Unerwartete Fehler: Exception
     * 4. Macht API-Antworten konsistent und erleichtert Frontend-Fehlerbehandlung.
     */
}
