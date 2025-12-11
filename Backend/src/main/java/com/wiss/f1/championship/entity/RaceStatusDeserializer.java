package com.wiss.f1.championship.entity;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

/**
 * Custom Deserializer für RaceStatus, der sowohl Enum-Namen (OPEN, TIPPABLE, CLOSED)
 * als auch JSON-Werte (open, voting, closed) akzeptiert.
 */
public class RaceStatusDeserializer extends JsonDeserializer<RaceStatus> {

    @Override
    public RaceStatus deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return RaceStatus.fromString(value);
    }
}

