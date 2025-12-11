package com.wiss.f1.championship.dto;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public class TipResponseDTO {

    private Long raceId;
    private List<String> order;  // Array von Fahrernamen (Top 10)
    private LocalDateTime updatedAt;

    public TipResponseDTO() {
    }

    public TipResponseDTO(Long raceId, List<String> order, LocalDateTime updatedAt) {
        this.raceId = raceId;
        this.order = order;
        this.updatedAt = updatedAt;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

