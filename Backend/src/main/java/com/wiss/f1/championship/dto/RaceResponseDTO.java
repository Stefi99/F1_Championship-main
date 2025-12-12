package com.wiss.f1.championship.dto;

import java.time.LocalDate;
import java.util.List;

import com.wiss.f1.championship.entity.RaceStatus;

/**
 * DTO für die API-Antwort eines Rennens.
 *
 * Wird verwendet, um ein Rennen samt seiner Metadaten und Ergebnisreihenfolge
 * an das Frontend zu senden.
 */
public class RaceResponseDTO {

    private Long id;                  // ID des Rennens
    private String name;              // Name des Rennens
    private LocalDate date;           // Datum des Rennens
    private String track;             // Rennstrecke
    private String weather;           // Wetterbedingungen
    private String tyres;             // Reifeninformationen
    private RaceStatus status;        // Status des Rennens (z.B. SCHEDULED, FINISHED)
    private List<String> resultsOrder; // Finale Fahrerreihenfolge nach Rennen

    // Standardkonstruktor
    public RaceResponseDTO() {
    }

    // Konstruktor mit allen Feldern
    public RaceResponseDTO(Long id, String name, LocalDate date, String track,
                           String weather, String tyres, RaceStatus status, List<String> resultsOrder) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.track = track;
        this.weather = weather;
        this.tyres = tyres;
        this.status = status;
        this.resultsOrder = resultsOrder;
    }

    // Getter und Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTrack() { return track; }
    public void setTrack(String track) { this.track = track; }

    public String getWeather() { return weather; }
    public void setWeather(String weather) { this.weather = weather; }

    public String getTyres() { return tyres; }
    public void setTyres(String tyres) { this.tyres = tyres; }

    public RaceStatus getStatus() { return status; }
    public void setStatus(RaceStatus status) { this.status = status; }

    public List<String> getResultsOrder() { return resultsOrder; }
    public void setResultsOrder(List<String> resultsOrder) { this.resultsOrder = resultsOrder; }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (RaceResponseDTO.java)
   ------------------------------------------------------------
   - DTO für die API-Antwort eines Rennens
   - Enthält Metadaten wie Name, Datum, Strecke, Wetter, Reifen, Status
   - Enthält die finale Reihenfolge der Fahrer (resultsOrder)
   - Wird im RaceController verwendet, um Rennen ans Frontend zu senden
   ============================================================ */
