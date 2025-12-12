package com.wiss.f1.championship.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wiss.f1.championship.dto.RaceDTO;
import com.wiss.f1.championship.dto.RaceResponseDTO;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.service.RaceService;

@RestController
@RequestMapping("/api/races")
public class RaceController {

    private final RaceService raceService;

    public RaceController(RaceService raceService) {
        this.raceService = raceService;
    }

    /**
     * Gibt alle Rennen zurück.
     */
    @GetMapping
    public List<Race> getAllRaces() {
        return raceService.getAllRaces();
    }

    /**
     * Gibt ein einzelnes Rennen anhand der ID zurück.
     */
    @GetMapping("/{id}")
    public Race getRaceById(@PathVariable Long id) {
        return raceService.getRaceById(id).orElse(null);
    }

    /**
     * Erstellt ein neues Rennen.
     */
    @PostMapping
    public Race createRace(@RequestBody Race race) {
        return raceService.createRace(race);
    }

    /**
     * Aktualisiert ein bestehendes Rennen.
     */
    @PutMapping("/{id}")
    public Race updateRace(@PathVariable Long id, @RequestBody Race race) {
        race.setId(id);
        // Debug-Ausgabe für Status des Rennens
        System.out.println("UPDATING RACE");
        System.out.println(race.getStatus());
        return raceService.updateRace(race);
    }

    /**
     * Löscht ein Rennen anhand der ID.
     */
    @DeleteMapping("/{id}")
    public void deleteRace(@PathVariable Long id) {
        raceService.deleteRace(id);
    }

    /**
     * Aktualisiert die Ergebnisreihenfolge eines Rennens.
     * @param id ID des Rennens
     * @param raceDTO DTO mit der neuen Ergebnisreihenfolge
     * @return Aktualisiertes RaceResponseDTO
     */
    @PutMapping("/{id}/results")
    public RaceResponseDTO updateRaceResults(@PathVariable Long id, @RequestBody RaceDTO raceDTO) {
        Race race = raceService.updateRaceResults(id, raceDTO.getResultsOrder());
        return convertToResponseDTO(race);
    }

    /**
     * Hilfsmethode zur Umwandlung eines Race-Objekts in ein RaceResponseDTO
     */
    private RaceResponseDTO convertToResponseDTO(Race race) {
        return new RaceResponseDTO(
                race.getId(),
                race.getName(),
                race.getDate(),
                race.getTrack(),
                race.getWeather(),
                race.getTyres(),
                race.getStatus(),
                race.getResultsOrder()
        );
    }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (RaceController.java)
   ------------------------------------------------------------
   - Verwaltet CRUD-Operationen für Rennen (Races).
   - Endpunkte:
       GET /api/races → alle Rennen
       GET /api/races/{id} → Rennen nach ID
       POST /api/races → neues Rennen erstellen
       PUT /api/races/{id} → Rennen aktualisieren
       DELETE /api/races/{id} → Rennen löschen
       PUT /api/races/{id}/results → Ergebnisreihenfolge aktualisieren
   - Nutzt RaceService für die Business-Logik.
   - Enthält interne Methode zur Umwandlung von Race in RaceResponseDTO.
   ============================================================ */
