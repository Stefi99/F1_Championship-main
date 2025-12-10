package com.wiss.f1.championship.repository;

import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.entity.Tip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TipRepository extends JpaRepository<Tip, Long> {

    List<Tip> findByUserId(Long userId);

    List<Tip> findByRaceId(Long raceId);

    Optional<Tip> findByUserIdAndRaceIdAndPredictedPosition(Long userId, Long raceId, Integer predictedPosition);

    List<Tip> findByUserIdAndRaceId(Long userId, Long raceId);

    List<Tip> findByUser(AppUser user);

    List<Tip> findByRace(Race race);

    boolean existsByUserAndRace(AppUser user, Race race);
}