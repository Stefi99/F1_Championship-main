// Die Entität "Tip" verbindet User, Race und Driver miteinander.
package com.wiss.f1.Championship.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "tips")
public class Tip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Viele Tipps gehören zu einem User
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    // Viele Tipps gehören zu einem Rennen
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id")
    private Race race;

    // Viele Tipps beziehen sich auf einen Driver
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(nullable = false)
    private Integer predictedPosition; // 1 bis 10

    // Leerer Konstruktor
    public Tip() {
    }

    public Tip(AppUser user, Race race, Driver driver, Integer predictedPosition) {
        this.user = user;
        this.race = race;
        this.driver = driver;
        this.predictedPosition = predictedPosition;
    }

    // Getter und Setter

    public Long getId() {
        return id;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
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

    public Integer getPredictedPosition() {
        return predictedPosition;
    }

    public void setPredictedPosition(Integer predictedPosition) {
        this.predictedPosition = predictedPosition;
    }
}