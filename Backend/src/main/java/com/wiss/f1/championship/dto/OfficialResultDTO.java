package com.wiss.f1.championship.dto;

/**
 * DTO für OfficialResult-Entität.
 *
 * Dient dazu, offizielle Rennergebnisse an das Frontend zu übertragen.
 * Enthält Informationen zu:
 * - dem Rennen (ID, Name)
 * - dem Fahrer (ID, Name, Team)
 * - der finalen Position im Rennen
 */
public class OfficialResultDTO {

    private Long id;             // Interne ID des Ergebnisses
    private Long raceId;         // ID des Rennens
    private String raceName;     // Name des Rennens
    private Long driverId;       // ID des Fahrers
    private String driverName;   // Name des Fahrers
    private String driverTeam;   // Team des Fahrers
    private Integer finalPosition; // Endposition im Rennen

    // Standardkonstruktor
    public OfficialResultDTO() {
    }

    // Konstruktor mit allen Feldern
    public OfficialResultDTO(Long id, Long raceId, String raceName,
                             Long driverId, String driverName, String driverTeam,
                             Integer finalPosition) {
        this.id = id;
        this.raceId = raceId;
        this.raceName = raceName;
        this.driverId = driverId;
        this.driverName = driverName;
        this.driverTeam = driverTeam;
        this.finalPosition = finalPosition;
    }

    // Getter und Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRaceId() { return raceId; }
    public void setRaceId(Long raceId) { this.raceId = raceId; }

    public String getRaceName() { return raceName; }
    public void setRaceName(String raceName) { this.raceName = raceName; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverTeam() { return driverTeam; }
    public void setDriverTeam(String driverTeam) { this.driverTeam = driverTeam; }

    public Integer getFinalPosition() { return finalPosition; }
    public void setFinalPosition(Integer finalPosition) { this.finalPosition = finalPosition; }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (OfficialResultDTO.java)
   ------------------------------------------------------------
   - DTO für offizielle Rennergebnisse
   - Enthält Rennen-ID/-Name, Fahrer-ID/-Name/-Team und finale Position
   - Wird vom OfficialResultController für API-Responses genutzt
   ============================================================ */
