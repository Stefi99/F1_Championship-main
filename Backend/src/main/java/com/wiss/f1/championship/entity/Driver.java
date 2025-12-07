package com.wiss.f1.championship.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;   // z. B. "Max Verstappen"

    @Column(nullable = false, length = 100)
    private String team;   // z. B. "Red Bull Racing"

    // Leerer Konstruktor
    public Driver() {
    }

    public Driver(String name, String team) {
        this.name = name;
        this.team = team;
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

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public void setId(Long id) {
    }
}
