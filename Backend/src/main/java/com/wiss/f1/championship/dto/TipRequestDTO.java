package com.wiss.f1.championship.dto;

import java.util.List;

/**
 * DTO für das Übermitteln eines Tipps (TipRequest) eines Users.
 *
 * Enthält die ID des Rennens und die vom User vorhergesagte
 * Fahrerreihenfolge (Top 10).
 * Wird für POST/PUT Requests im TipController verwendet.
 */
public class TipRequestDTO {

    private Long raceId;        // ID des Rennens, für das der Tipp abgegeben wird
    private List<String> order; // Array von Fahrernamen in der vorhergesagten Reihenfolge

    // Standardkonstruktor
    public TipRequestDTO() {
    }

    // Konstruktor mit allen Feldern
    public TipRequestDTO(Long raceId, List<String> order) {
        this.raceId = raceId;
        this.order = order;
    }

    // Getter und Setter
    public Long getRaceId() { return raceId; }
    public void setRaceId(Long raceId) { this.raceId = raceId; }

    public List<String> getOrder() { return order; }
    public void setOrder(List<String> order) { this.order = order; }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (TipRequestDTO.java)
   ------------------------------------------------------------
   - DTO für User-Tipps zu einem Rennen
   - Felder: raceId (Rennen) und order (vorhergesagte Fahrerreihenfolge)
   - Wird im TipController für create/update von Tipps verwendet
   ============================================================ */
