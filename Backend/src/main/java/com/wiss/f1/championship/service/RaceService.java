package com.wiss.f1.championship.service;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.exception.RaceNotFoundException;
import com.wiss.f1.championship.repository.RaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RaceService {

    private final RaceRepository raceRepository;

    public RaceService(RaceRepository raceRepository) {
        this.raceRepository = raceRepository;
    }

    public List<Race> getAllRaces() {
        return raceRepository.findAll();
    }

    public Optional<Race> getRaceById(Long id) {
        return raceRepository.findById(id);
    }

    public Race createRace(Race race) {
        return raceRepository.save(race);
    }

    public Race updateRace(Race race) {
        return raceRepository.save(race);
    }

    public void deleteRace(Long id) {
        raceRepository.deleteById(id);
    }

    public Race updateRaceResults(Long id, List<String> resultsOrder) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new RaceNotFoundException("Race nicht gefunden mit ID: " + id));
        race.setResultsOrder(resultsOrder);
        return raceRepository.save(race);
    }
}