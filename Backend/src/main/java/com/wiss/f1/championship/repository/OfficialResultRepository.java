package com.wiss.f1.championship.repository;

import com.wiss.f1.championship.entity.OfficialResult;
import com.wiss.f1.championship.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository für OfficialResult-Entitäten.
 * Bietet Zugriff auf die "official_results"-Tabelle.
 * Ermöglicht CRUD-Operationen und Abfragen basierend auf Rennen.
 */
@Repository
public interface OfficialResultRepository extends JpaRepository<OfficialResult, Long> {

    /**
     * Liefert alle offiziellen Ergebnisse für ein gegebenes Rennen.
     * @param race Das Rennen
     * @return Liste der OfficialResult-Objekte
     */
    List<OfficialResult> findByRace(Race race);

    /**
     * Liefert alle offiziellen Ergebnisse für ein Rennen anhand seiner ID.
     * @param id ID des Rennens
     * @return Liste der OfficialResult-Objekte
     */
    List<OfficialResult> findByRaceId(Long id);
}

/*
 * Zusammenfassung:
 * Dieses Interface stellt die Datenzugriffsschicht für OfficialResult bereit.
 * Es erweitert JpaRepository, wodurch Standard-CRUD-Methoden verfügbar sind.
 * Zusätzlich können alle Ergebnisse eines bestimmten Rennens über Race-Objekt
 * oder die Renn-ID abgefragt werden.
 */
