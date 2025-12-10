package com.wiss.f1.championship.dto;

import com.wiss.f1.championship.entity.RaceStatus;
import java.time.LocalDate;
import java.util.List;

public class RaceResponseDTO {

    private Long id;
    private String name;
    private LocalDate date;
    private String track;
    private String weather;
    private RaceStatus status;
    private List<String> resultsOrder;

    public RaceResponseDTO() {
    }

    public RaceResponseDTO(Long id, String name, LocalDate date, String track, 
                          String weather, RaceStatus status, List<String> resultsOrder) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.track = track;
        this.weather = weather;
        this.status = status;
        this.resultsOrder = resultsOrder;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTrack() {
        return track;
    }

    public void setTrack(String track) {
        this.track = track;
    }

    public String getWeather() {
        return weather;
    }

    public void setWeather(String weather) {
        this.weather = weather;
    }

    public RaceStatus getStatus() {
        return status;
    }

    public void setStatus(RaceStatus status) {
        this.status = status;
    }

    public List<String> getResultsOrder() {
        return resultsOrder;
    }

    public void setResultsOrder(List<String> resultsOrder) {
        this.resultsOrder = resultsOrder;
    }
}

