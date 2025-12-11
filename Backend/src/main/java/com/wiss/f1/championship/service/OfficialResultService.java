package com.wiss.f1.championship.service;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.wiss.f1.championship.entity.OfficialResult;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.repository.OfficialResultRepository;

@Service
public class OfficialResultService {

    private final OfficialResultRepository resultRepository;

    public OfficialResultService(OfficialResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    public Optional<OfficialResult> getById(Long id) {
        return resultRepository.findById(id);
    }

    public List<OfficialResult> getResultsForRace(Race race) {
        return resultRepository.findByRace(race);
    }

    public OfficialResult createResult(OfficialResult result) {
        return resultRepository.save(result);
    }

    public void deleteResult(Long id) {
        resultRepository.deleteById(id);
    }

    public void deleteResultsForRace(Long raceId) {
        List<OfficialResult> results = resultRepository.findByRaceId(raceId);
        resultRepository.deleteAll(results);
    }
}
