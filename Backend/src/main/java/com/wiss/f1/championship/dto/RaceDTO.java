package com.wiss.f1.championship.dto;

import java.util.List;

/**
 * DTO für Race-Updates, insbesondere für die Reihenfolge der Fahrergebnisse.
 *
 * Dient dazu, die finale Ergebnisreihenfolge eines Rennens vom Frontend
 * zum Backend zu übertragen.
 */
public class RaceDTO {

    private List<String> resultsOrder;  // Liste von Fahrernamen in der Reihenfolge des Rennens

    // Standardkonstruktor
    public RaceDTO() {
    }

    // Konstruktor mit allen Feldern
    public RaceDTO(List<String> resultsOrder) {
        this.resultsOrder = resultsOrder;
    }

    // Getter und Setter
    public List<String> getResultsOrder() {
        return resultsOrder;
    }

    public void setResultsOrder(List<String> resultsOrder) {
        this.resultsOrder = resultsOrder;
    }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (RaceDTO.java)
   ------------------------------------------------------------
   - DTO für Rennen, speziell für die Ergebnisreihenfolge
   - Enthält eine Liste von Fahrernamen (resultsOrder)
   - Wird im RaceController genutzt, um finale Rennergebnisse zu aktualisieren
   ============================================================ */
