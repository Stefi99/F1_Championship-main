package com.wiss.f1.championship.entity;

import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

/**
 * Enum für den Status eines Rennens.
 *
 * - OPEN: Rennen erstellt, noch keine Voting möglich
 * - TIPPABLE: Voting/Tipps möglich (Frontend verwendet "voting")
 * - CLOSED: Voting geschlossen, Ergebnisse werden eingetragen
 *
 * Unterstützt JSON-Serialisierung und Deserialisierung über RaceStatusDeserializer.
 */
@JsonDeserialize(using = RaceStatusDeserializer.class)
public enum RaceStatus {
    OPEN("open"),          // Rennen erstellt, Voting noch nicht möglich
    TIPPABLE("voting"),    // Voting möglich, Frontend nutzt "voting"
    CLOSED("closed");      // Voting abgeschlossen, Ergebnisse eintragen

    // Wert, der in JSON zurückgegeben oder aus JSON gelesen wird
    private final String jsonValue;

    RaceStatus(String jsonValue) {
        this.jsonValue = jsonValue;
    }

    @JsonValue
    public String getJsonValue() {
        return jsonValue;
    }

    /**
     * Konvertiert einen String-Wert (z.B. aus Frontend) zurück zu einem RaceStatus.
     * Akzeptiert sowohl:
     *  - Enum-Namen (OPEN, TIPPABLE, CLOSED)
     *  - JSON-Werte (open, voting, closed)
     *
     * @param value String-Wert
     * @return entsprechender RaceStatus
     * @throws IllegalArgumentException wenn der Wert ungültig ist
     */
    public static RaceStatus fromString(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().toUpperCase();
        for (RaceStatus status : RaceStatus.values()) {
            if (status.name().equals(normalized) || status.jsonValue.equalsIgnoreCase(value)) {
                // Debug-Ausgabe zur Kontrolle
                System.out.println("Set status to " + status + " (" + status.name().equals(normalized) + ", " + status.jsonValue.equalsIgnoreCase(value) + ")");
                return status;
            }
        }
        throw new IllegalArgumentException("Ungültiger RaceStatus: " + value);
    }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (RaceStatus.java)
   ------------------------------------------------------------
   - Enum für Rennstatus: OPEN, TIPPABLE, CLOSED
   - Unterstützt JSON-Serialisierung/Deserialisierung
   - fromString() wandelt Strings vom Frontend oder Enum-Namen in RaceStatus um
   - Dient zur Standardisierung der Statuswerte im Backend
   ============================================================ */
