package com.wiss.f1.championship.entity;

import jakarta.persistence.*;

/**
 * Entity für einen F1-Fahrer.
 * Speichert Name und Team des Fahrers.
 */
@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Primärschlüssel

    @Column(nullable = false, length = 100)
    private String name;   // Fahrername, z.B. "Max Verstappen"

    @Column(nullable = false, length = 100)
    private String team;   // Teamname, z.B. "Red Bull Racing"

    // Leerer Konstruktor für JPA
    public Driver() {
    }

    // Konstruktor mit Name und Team
    public Driver(String name, String team) {
        this.name = name;
        this.team = team;
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

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (Driver.java)
   ------------------------------------------------------------
   - Entity für einen F1-Fahrer
   - Felder: id, name, team
   - Wird in DriverController und Tip/Race-Logik verwendet
   - Unterstützt CRUD-Operationen über Service/Repository
   ============================================================ */
