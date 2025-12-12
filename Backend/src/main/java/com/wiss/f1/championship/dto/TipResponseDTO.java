package com.wiss.f1.championship.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO für die Antwort eines Tipps (TipResponse) eines Users.
 *
 * Enthält die ID des Rennens, die vom User abgegebene Fahrerreihenfolge
 * und den Zeitpunkt der letzten Aktualisierung.
 * Wird für GET/POST/PUT Responses im TipController verwendet.
 */
public class TipResponseDTO {

    private Long raceId;        // ID des Rennens, für das der Tipp gilt
    private List<String> order; // Array von Fahrernamen in der vorhergesagten Reihenfolge
    private LocalDateTime updatedAt; // Zeitpunkt der letzten Aktualisierung des Tipps

    // Standardkonstruktor
    public TipResponseDTO() {
    }

    // Konstruktor mit allen Feldern
    public TipResponseDTO(Long raceId, List<String> order, LocalDateTime updatedAt) {
        this.raceId = raceId;
        this.order = order;
        this.updatedAt = updatedAt;
    }

    // Getter und Setter
    public Long getRaceId() { return raceId; }
    public void setRaceId(Long raceId) { this.raceId = raceId; }

    public List<String> getOrder() { return order; }
    public void setOrder(List<String> order) { this.order = order; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (TipResponseDTO.java)
   ------------------------------------------------------------
   - DTO für die Antwort eines User-Tipps
   - Felder: raceId, order (Fahrerreihenfolge), updatedAt (Zeitpunkt der letzten Änderung)
   - Wird im TipController für GET/POST/PUT Responses verwendet
   ============================================================ */
