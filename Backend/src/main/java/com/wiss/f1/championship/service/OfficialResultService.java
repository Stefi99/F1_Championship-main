package com.wiss.f1.championship.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.wiss.f1.championship.entity.OfficialResult;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.repository.OfficialResultRepository;

/**
 * Service für offizielle Rennergebnisse (OfficialResult).
 *
 * Aufgaben:
 * - Ergebnisse erstellen, abrufen und löschen
 * - Abruf von Ergebnissen pro Rennen
 * - Löschen aller Ergebnisse eines Rennens
 */
@Service
public class OfficialResultService {

    private final OfficialResultRepository resultRepository;

    public OfficialResultService(OfficialResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    /**
     * Holt ein offizielles Ergebnis anhand der ID.
     * @param id ID des OfficialResult
     * @return Optional mit dem Ergebnis oder empty, falls nicht vorhanden
     */
    public Optional<OfficialResult> getById(Long id) {
        return resultRepository.findById(id);
    }

    /**
     * Holt alle offiziellen Ergebnisse für ein bestimmtes Rennen.
     * @param race Das Rennen
     * @return Liste der OfficialResult-Objekte
     */
    public List<OfficialResult> getResultsForRace(Race race) {
        return resultRepository.findByRace(race);
    }

    /**
     * Speichert ein neues offizielles Ergebnis.
     * @param result OfficialResult Objekt
     * @return Gespeichertes Ergebnis
     */
    public OfficialResult createResult(OfficialResult result) {
        return resultRepository.save(result);
    }

    /**
     * Löscht ein offizielles Ergebnis anhand der ID.
     * @param id ID des OfficialResult
     */
    public void deleteResult(Long id) {
        resultRepository.deleteById(id);
    }

    /**
     * Löscht alle offiziellen Ergebnisse eines bestimmten Rennens.
     * @param raceId ID des Rennens
     */
    public void deleteResultsForRace(Long raceId) {
        List<OfficialResult> results = resultRepository.findByRaceId(raceId);
        resultRepository.deleteAll(results);
    }
}

/*
 * Zusammenfassung:
 * OfficialResultService kapselt die Geschäftslogik für offizielle Rennergebnisse.
 * Es ermöglicht das Erstellen, Abrufen und Löschen einzelner Ergebnisse sowie das
 * Löschen aller Ergebnisse für ein bestimmtes Rennen.
 */
