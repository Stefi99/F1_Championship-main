package com.wiss.f1.Championship.service;
import com.wiss.f1.Championship.entity.OfficialResult;
import com.wiss.f1.Championship.entity.Race;
import com.wiss.f1.Championship.repository.OfficialResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
}
