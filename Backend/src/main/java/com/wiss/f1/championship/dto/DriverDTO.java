package com.wiss.f1.championship.dto;

/**
 * DTO für Driver-Entität.
 * Wird für API-Responses verwendet, um Driver-Informationen zu übertragen.
 */
public class DriverDTO {

    private Long id;
    private String name;
    private String team;

    public DriverDTO() {
    }

    public DriverDTO(Long id, String name, String team) {
        this.id = id;
        this.name = name;
        this.team = team;
    }

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

