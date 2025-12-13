package com.wiss.f1.championship.dto;

/**
 * DTO für die Driver-Entität.
 *
 * Wird verwendet, um Driver-Daten in API-Responses zu übertragen.
 * Enthält nur die relevanten Informationen für die Frontend-Darstellung:
 * - id: eindeutige Fahrer-ID
 * - name: Name des Fahrers
 * - team: Team des Fahrers
 */
public class DriverDTO {

    private Long id;      // ID des Fahrers
    private String name;  // Name des Fahrers
    private String team;  // Team des Fahrers

    // Leerer Konstruktor für Serialisierung / Frameworks
    public DriverDTO() {
    }

    // Konstruktor für schnelle Erstellung eines DTOs
    public DriverDTO(Long id, String name, String team) {
        this.id = id;
        this.name = name;
        this.team = team;
    }

    // Getter und Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (DriverDTO.java)
   ------------------------------------------------------------
   - DTO für Fahrer-Entität (Driver)
   - Enthält nur die wichtigsten Felder: id, name, team
   - Dient für API-Responses, um unnötige Entity-Daten zu vermeiden
   ============================================================ */
