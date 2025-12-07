package com.wiss.f1.Championship.repository;
import com.wiss.f1.Championship.entity.OfficialResult;
import com.wiss.f1.Championship.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfficialResultRepository extends JpaRepository<OfficialResult, Long> {

    List<OfficialResult> findByRace(Race race);
}