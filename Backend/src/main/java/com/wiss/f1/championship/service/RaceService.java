package com.wiss.f1.championship.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.entity.RaceStatus;
import com.wiss.f1.championship.exception.RaceNotFoundException;
import com.wiss.f1.championship.repository.RaceRepository;

/**
 * Service für Rennen (Race).
 *
 * Aufgaben:
 * - Rennen erstellen, abrufen, aktualisieren und löschen
 * - Speichern der offiziellen Ergebnisse eines Rennens
 * - Statusverwaltung (z.B. CLOSED nach Ergebnisaktualisierung)
 */
@Service
public class RaceService {

    private final RaceRepository raceRepository;

    public RaceService(RaceRepository raceRepository) {
        this.raceRepository = raceRepository;
    }

    /**
     * Gibt alle Rennen zurück.
     * @return Liste aller Rennen
     */
    public List<Race> getAllRaces() {
        return raceRepository.findAll();
    }

    /**
     * Holt ein Rennen anhand der ID.
     * @param id ID des Rennens
     * @return Optional mit dem Rennen oder empty, falls nicht gefunden
     */
    public Optional<Race> getRaceById(Long id) {
        return raceRepository.findById(id);
    }

    /**
     * Erstellt ein neues Rennen.
     * @param race Race Objekt
     * @return Gespeichertes Rennen
     */
    public Race createRace(Race race) {
        return raceRepository.save(race);
    }

    /**
     * Aktualisiert ein vorhandenes Rennen.
     * @param race Race Objekt mit neuen Werten
     * @return Aktualisiertes Rennen
     */
    public Race updateRace(Race race) {
        return raceRepository.save(race);
    }

    /**
     * Löscht ein Rennen anhand der ID.
     * @param id ID des Rennens
     */
    public void deleteRace(Long id) {
        raceRepository.deleteById(id);
    }

    /**
     * Aktualisiert die Ergebnisreihenfolge eines Rennens.
     * Setzt automatisch den Status auf CLOSED.
     * @param id ID des Rennens
     * @param resultsOrder Liste der Fahrernamen in korrekter Reihenfolge
     * @return Aktualisiertes Rennen
     * @throws RaceNotFoundException falls das Rennen nicht existiert
     */
    public Race updateRaceResults(Long id, List<String> resultsOrder) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new RaceNotFoundException("Race nicht gefunden mit ID: " + id));
        race.setResultsOrder(resultsOrder);
        race.setStatus(RaceStatus.CLOSED);
        return raceRepository.save(race);
    }
}

/*
 * Zusammenfassung:
 * RaceService kapselt die Geschäftslogik für Rennen.
 * Es ermöglicht das Erstellen, Abrufen, Aktualisieren und Löschen von Rennen.
 * Außerdem kann die offizielle Ergebnisreihenfolge eines Rennens gespeichert werden,
 * wodurch der Status automatisch auf CLOSED gesetzt wird.
 */
