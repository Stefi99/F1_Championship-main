package com.wiss.f1.Championship.service;
import com.wiss.f1.Championship.entity.*;
import com.wiss.f1.Championship.repository.TipRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipService {

    private final TipRepository tipRepository;

    public TipService(TipRepository tipRepository) {
        this.tipRepository = tipRepository;
    }

    public Optional<Tip> getTipById(Long id) {
        return tipRepository.findById(id);
    }

    public List<Tip> getTipsByUser(AppUser user) {
        return tipRepository.findByUser(user);
    }

    public List<Tip> getTipsByRace(Race race) {
        return tipRepository.findByRace(race);
    }

    public Tip createTip(Tip tip) {
        return tipRepository.save(tip);
    }

    public void deleteTip(Long id) {
        tipRepository.deleteById(id);
    }

    public boolean hasUserAlreadyTipped(AppUser user, Race race) {
        return tipRepository.existsByUserAndRace(user, race);
    }
}
