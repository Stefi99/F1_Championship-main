package com.wiss.f1.Championship.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

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
}