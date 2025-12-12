package com.wiss.f1.championship.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Entität "Tip" speichert die Tipps eines Users für ein bestimmtes Rennen.
 * Jeder Tipp verbindet:
 * - einen User (AppUser)
 * - ein Rennen (Race)
 * - einen Fahrer (Driver)
 *
 * Zusätzliche Informationen:
 * - predictedPosition: Vorhergesagte Platzierung des Fahrers (1–10)
 * - updatedAt: Zeitpunkt der letzten Aktualisierung (automatisch gesetzt)
 *
 * Datenbanktabelle: "voting"
 */
@Entity
@Table(name = "voting")
public class Tip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Beziehung zu User: Viele Tipps gehören zu einem User
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    // Beziehung zu Race: Viele Tipps gehören zu einem Rennen
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id")
    private Race race;

    // Beziehung zu Driver: Jeder Tipp bezieht sich auf einen Fahrer
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    // Vorhergesagte Platzierung des Fahrers
    @Column(nullable = false)
    private Integer predictedPosition;

    // Automatisch aktualisierter Zeitstempel bei Änderungen
    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;

    public Tip() {
    }

    public Tip(AppUser user, Race race, Driver driver, Integer predictedPosition, LocalDateTime updatedAt) {
        this.user = user;
        this.race = race;
        this.driver = driver;
        this.predictedPosition = predictedPosition;
        this.updatedAt = updatedAt;
    }

    // Getter & Setter
    public Long getId() { return id; }
    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }
    public Race getRace() { return race; }
    public void setRace(Race race) { this.race = race; }
    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }
    public Integer getPredictedPosition() { return predictedPosition; }
    public void setPredictedPosition(Integer predictedPosition) { this.predictedPosition = predictedPosition; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

/* ============================================================
   ZUSAMMENFASSUNG DES FILES (Tip.java)
   ------------------------------------------------------------
   - Repräsentiert einen Tipp eines Users für einen Fahrer in einem Rennen
   - Verknüpft AppUser, Race und Driver über ManyToOne-Beziehungen
   - Enthält vorhergesagte Position und Update-Zeitstempel
   - Persistiert in Tabelle "voting"
   ============================================================ */
