package com.wiss.f1.championship.dto;

/**
 * DTO für OfficialResult-Entität.
 * Wird für API-Responses verwendet, um offizielle Rennergebnisse zu übertragen.
 */
public class OfficialResultDTO {

    private Long id;
    private Long raceId;
    private String raceName;
    private Long driverId;
    private String driverName;
    private String driverTeam;
    private Integer finalPosition;

    public OfficialResultDTO() {
    }

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRaceId() {
        return raceId;
    }

    public void setRaceId(Long raceId) {
        this.raceId = raceId;
    }

    public String getRaceName() {
        return raceName;
    }

    public void setRaceName(String raceName) {
        this.raceName = raceName;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverTeam() {
        return driverTeam;
    }

    public void setDriverTeam(String driverTeam) {
        this.driverTeam = driverTeam;
    }

    public Integer getFinalPosition() {
        return finalPosition;
    }

    public void setFinalPosition(Integer finalPosition) {
        this.finalPosition = finalPosition;
    }
}

