package com.wiss.f1.championship.repository;

import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.entity.Tip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository für Tip-Entitäten.
 * Stellt Methoden bereit, um Tipps (Prognosen der Nutzer für Rennen) zu speichern,
 * abzurufen und zu prüfen, ob ein Tipp bereits existiert.
 */
public interface TipRepository extends JpaRepository<Tip, Long> {

    // Alle Tipps eines Users anhand der User-ID abrufen
    List<Tip> findByUserId(Long userId);

    // Alle Tipps für ein bestimmtes Rennen anhand der Race-ID abrufen
    List<Tip> findByRaceId(Long raceId);

    // Tipp für einen User, ein Rennen und eine bestimmte vorhergesagte Position abrufen
    Optional<Tip> findByUserIdAndRaceIdAndPredictedPosition(Long userId, Long raceId, Integer predictedPosition);

    // Alle Tipps eines Users für ein bestimmtes Rennen abrufen
    List<Tip> findByUserIdAndRaceId(Long userId, Long raceId);

    // Alle Tipps eines Users abrufen (Objekt statt ID)
    List<Tip> findByUser(AppUser user);

    // Alle Tipps für ein Rennen abrufen (Objekt statt ID)
    List<Tip> findByRace(Race race);

    // Prüfen, ob ein Tipp für einen User und ein Rennen existiert
    boolean existsByUserAndRace(AppUser user, Race race);
}

/*
 * Zusammenfassung:
 * Dieses Interface dient als Datenzugriffsschicht für die Tip-Entität.
 * Es bietet neben den Standard-CRUD-Methoden zusätzliche Abfragen,
 * um Tipps nach User, Rennen oder vorhergesagter Position zu filtern.
 */
