package com.wiss.f1.championship.repository;
import com.wiss.f1.championship.entity.OfficialResult;
import com.wiss.f1.championship.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfficialResultRepository extends JpaRepository<OfficialResult, Long> {

    List<OfficialResult> findByRace(Race race);

    List<OfficialResult> findByRaceId(Long id);
}