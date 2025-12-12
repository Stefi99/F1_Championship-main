package com.wiss.f1.championship.entity;

import jakarta.persistence.*;

/**
 * Entity für offizielle Rennergebnisse.
 * Verknüpft ein Rennen mit einem Fahrer und der finalen Position.
 */
@Entity
@Table(name = "official_results")
public class OfficialResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primärschlüssel

    // Ergebnis gehört zu genau einem Rennen
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id")
    private Race race;

    // Ergebnis gehört zu genau einem Fahrer
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(nullable = false)
    private Integer finalPosition; // Endplatzierung im Rennen (1 bis 20)

    // Leerer Konstruktor für JPA
    public OfficialResult() {
    }

    // Konstruktor mit Race, Driver und finaler Position
    public OfficialResult(Race race, Driver driver, Integer finalPosition) {
        this.race = race;
        this.driver = driver;
        this.finalPosition = finalPosition;
    }

    // Getter und Setter
    public Long getId() {
        return id;
    }

    public Race getRace() {
        return race;
    }

    public void setRace(Race race) {
        this.race = race;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Integer getFinalPosition() {
        return finalPosition;
    }

    public void setFinalPosition(Integer finalPosition) {
        this.finalPosition = finalPosition;
    }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (OfficialResult.java)
   ------------------------------------------------------------
   - Entity für ein offizielles Rennergebnis
   - Felder: id, race, driver, finalPosition
   - Verknüpft Race und Driver über ManyToOne-Beziehungen
   - Wird in OfficialResultController und Leaderboard-Logik verwendet
   ============================================================ */
