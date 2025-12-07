package com.wiss.f1.championship.repository;
import com.wiss.f1.championship.entity.Tip;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipRepository extends JpaRepository<Tip, Long> {

    List<Tip> findByUser(AppUser user);

    List<Tip> findByRace(Race race);

    boolean existsByUserAndRace(AppUser user, Race race);
}
