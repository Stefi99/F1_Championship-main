package com.wiss.f1.championship.dto;

import java.util.List;

public class RaceDTO {

    private List<String> resultsOrder;  // Array von Fahrernamen

    public RaceDTO() {
    }

    public RaceDTO(List<String> resultsOrder) {
        this.resultsOrder = resultsOrder;
    }

    public List<String> getResultsOrder() {
        return resultsOrder;
    }

    public void setResultsOrder(List<String> resultsOrder) {
        this.resultsOrder = resultsOrder;
    }
}

