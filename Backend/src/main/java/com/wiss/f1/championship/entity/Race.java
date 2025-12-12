package com.wiss.f1.championship.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

/**
 * Entity für ein Rennen.
 * Enthält alle relevanten Informationen wie Name, Datum, Strecke, Wetter,
 * Reifenwahl, Status und die Reihenfolge der Fahrer-Ergebnisse.
 */
@Entity
@Table(name = "races")
public class Race {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primärschlüssel

    @Column(nullable = false, length = 100)
    private String name;      // Name des Rennens, z.B. "Bahrain GP"

    @Column(nullable = false)
    private LocalDate date;   // Datum des Rennens

    @Column(nullable = false, length = 100)
    private String track;     // Name der Strecke

    @Column(nullable = false, length = 50)
    private String weather;   // Wetterbedingungen als String (z.B. "sunny")

    @Column(length = 50)
    private String tyres;     // Reifenwahl (soft, medium, hard)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RaceStatus status;  // Status des Rennens (PLANNED, ONGOING, FINISHED)

    // Speicherung der Ergebnisreihenfolge als Liste von Fahrernamen
    @ElementCollection
    @CollectionTable(name = "race_results_order", joinColumns = @JoinColumn(name = "race_id"))
    @Column(name = "driver_name", length = 100)
    private List<String> resultsOrder = new ArrayList<>();

    // Leerer Konstruktor für JPA
    public Race() {
    }

    // Komfort-Konstruktor für einfaches Erstellen eines Rennobjekts
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

    public String getTyres() {
        return tyres;
    }

    public void setTyres(String tyres) {
        this.tyres = tyres;
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
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (Race.java)
   ------------------------------------------------------------
   - Entity für ein Formel-1-Rennen
   - Felder: id, name, date, track, weather, tyres, status, resultsOrder
   - resultsOrder speichert die Reihenfolge der Fahrer als Liste von Strings
   - Wird in RaceController, OfficialResultController und TipController verwendet
   ============================================================ */
