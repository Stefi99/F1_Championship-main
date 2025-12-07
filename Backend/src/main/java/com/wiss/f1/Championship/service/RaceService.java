package com.wiss.f1.Championship.service;
import com.wiss.f1.Championship.entity.Race;
import com.wiss.f1.Championship.repository.RaceRepository;
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
}