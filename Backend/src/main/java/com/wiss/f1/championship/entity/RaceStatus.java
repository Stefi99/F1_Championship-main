package com.wiss.f1.championship.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RaceStatus {
    OPEN("open"),          // Rennen erstellt, noch keine Tipps möglich
    TIPPABLE("voting"),   // Tippen möglich (Frontend verwendet "voting")
    CLOSED("closed");     // Tippen geschlossen, Ergebnise eintragen

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
     * Unterstützt sowohl die Enum-Namen (OPEN, TIPPABLE, CLOSED) als auch die JSON-Werte (open, voting, closed).
     */
    public static RaceStatus fromString(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().toUpperCase();
        for (RaceStatus status : RaceStatus.values()) {
            if (status.name().equals(normalized) || status.jsonValue.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Ungültiger RaceStatus: " + value);
    }
}
