package com.wiss.f1.championship.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "races")
public class Race {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;      // z. B. "Bahrain GP"

    @Column(nullable = false)
    private LocalDate date;   // Renndatum

    @Column(nullable = false, length = 100)
    private String track;     // Streckenname

    @Column(nullable = false, length = 50)
    private String weather;   // vorerst String, später evtl Enum

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RaceStatus status;

    @ElementCollection
    @CollectionTable(name = "race_results_order", joinColumns = @JoinColumn(name = "race_id"))
    @Column(name = "driver_name", length = 100)
    private List<String> resultsOrder = new ArrayList<>();

    // Leerer Konstruktor
    public Race() {
    }

    // Komfort Konstruktor
    public Race(String name, LocalDate date, String track, String weather, RaceStatus status) {
        this.name = name;
        this.date = date;
        this.track = track;
        this.weather = weather;
        this.status = status;
    }

    // Getter und Setter

    public Long getId() {
        return id;
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
        this.resultsOrder = resultsOrder != null ? resultsOrder : new ArrayList<>();
    }

    public void setId(Long id) {
        this.id = id;
    }
}