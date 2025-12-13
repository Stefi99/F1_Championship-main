package com.wiss.f1.championship.entity;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

/**
 * Custom Deserializer für RaceStatus.
 *
 * Zweck:
 * - Akzeptiert JSON-Werte wie "open", "voting", "closed"
 * - Akzeptiert Enum-Namen wie "OPEN", "TIPPABLE", "CLOSED"
 * - Wandelt diese Strings in das entsprechende RaceStatus-Enum um
 *
 * Wird automatisch bei der Deserialisierung von Race-Objekten verwendet,
 * die RaceStatus enthalten.
 */
public class RaceStatusDeserializer extends JsonDeserializer<RaceStatus> {

    @Override
    public RaceStatus deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();  // Wert aus JSON auslesen
        if (value == null || value.trim().isEmpty()) {
            return null;  // Falls leer, null zurückgeben
        }
        return RaceStatus.fromString(value); // Umwandeln in RaceStatus
    }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (RaceStatusDeserializer.java)
   ------------------------------------------------------------
   - Custom Jackson Deserializer für RaceStatus
   - Unterstützt Frontend-Strings und Enum-Namen
   - Verwendet RaceStatus.fromString() für die Umwandlung
   - Stellt sicher, dass JSON beim Einlesen korrekt in RaceStatus konvertiert wird
   ============================================================ */
