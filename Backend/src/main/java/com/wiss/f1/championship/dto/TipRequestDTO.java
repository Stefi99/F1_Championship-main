package com.wiss.f1.championship.dto;

import java.util.List;

public class TipRequestDTO {

    private Long raceId;
    private List<String> order;  // Array von Fahrernamen (Top 10)

    public TipRequestDTO() {
    }

    public TipRequestDTO(Long raceId, List<String> order) {
        this.raceId = raceId;
        this.order = order;
    }

    public Long getRaceId() {
        return raceId;
    }

    public void setRaceId(Long raceId) {
        this.raceId = raceId;
    }

    public List<String> getOrder() {
        return order;
    }

    public void setOrder(List<String> order) {
        this.order = order;
    }
}

