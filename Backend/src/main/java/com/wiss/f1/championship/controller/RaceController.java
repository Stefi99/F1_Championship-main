package com.wiss.f1.championship.controller;
import com.wiss.f1.championship.dto.RaceDTO;
import com.wiss.f1.championship.dto.RaceResponseDTO;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.service.RaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
public class RaceController {

    private final RaceService raceService;

    public RaceController(RaceService raceService) {
        this.raceService = raceService;
    }

    @GetMapping
    public List<Race> getAllRaces() {
        return raceService.getAllRaces();
    }

    @GetMapping("/{id}")
    public Race getRaceById(@PathVariable Long id) {
        return raceService.getRaceById(id)
                .orElse(null);
    }

    @PostMapping
    public Race createRace(@RequestBody Race race) {
        return raceService.createRace(race);
    }

    @PutMapping("/{id}")
    public Race updateRace(@PathVariable Long id, @RequestBody Race race) {
        race.setId(id);
        return raceService.updateRace(race);
    }

    @DeleteMapping("/{id}")
    public void deleteRace(@PathVariable Long id) {
        raceService.deleteRace(id);
    }

    @PutMapping("/{id}/results")
    public RaceResponseDTO updateRaceResults(@PathVariable Long id, @RequestBody RaceDTO raceDTO) {
        Race race = raceService.updateRaceResults(id, raceDTO.getResultsOrder());
        return convertToResponseDTO(race);
    }

    private RaceResponseDTO convertToResponseDTO(Race race) {
        return new RaceResponseDTO(
                race.getId(),
                race.getName(),
                race.getDate(),
                race.getTrack(),
                race.getWeather(),
                race.getStatus(),
                race.getResultsOrder()
        );
    }
}
