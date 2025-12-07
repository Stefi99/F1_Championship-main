package com.wiss.f1.Championship.repository;
import com.wiss.f1.Championship.entity.Tip;
import com.wiss.f1.Championship.entity.AppUser;
import com.wiss.f1.Championship.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipRepository extends JpaRepository<Tip, Long> {

    List<Tip> findByUser(AppUser user);

    List<Tip> findByRace(Race race);

    boolean existsByUserAndRace(AppUser user, Race race);
}
