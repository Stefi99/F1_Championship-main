package com.wiss.f1.championship.service.test;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.entity.RaceStatus;
import com.wiss.f1.championship.repository.RaceRepository;
import com.wiss.f1.championship.service.RaceService;


class RaceServiceTest {

    private RaceRepository raceRepository;
    private RaceService raceService;

    @BeforeEach
    void setUp() {
        // Mockito-Mock für das Repository erstellen, Service mit Mock initialisieren
        raceRepository = mock(RaceRepository.class);
        raceService = new RaceService(raceRepository);
    }

    @Test
    void testCreateRace() {
        // Testet das Erstellen eines neuen Rennens
        Race race = new Race();
        race.setName("Bahrain GP");
        race.setDate(LocalDate.of(2024, 3, 2));
        race.setTrack("Bahrain International Circuit");
        race.setWeather("Sunny");
        race.setStatus(RaceStatus.OPEN);

        // Mock: save() gibt das übergebene Objekt zurück
        when(raceRepository.save(any(Race.class))).thenReturn(race);

        Race saved = raceService.createRace(race);

        // Prüfen, dass das Rennen korrekt gespeichert wurde
        assertNotNull(saved);
        assertEquals("Bahrain GP", saved.getName());
        assertEquals(RaceStatus.OPEN, saved.getStatus());

        verify(raceRepository, times(1)).save(any(Race.class));
    }

    @Test
    void testUpdateRace() {
        // Testet die Aktualisierung eines bestehenden Rennens
        Race race = new Race();
        race.setId(1L);
        race.setName("Bahrain GP");
        race.setDate(LocalDate.of(2024, 3, 2));
        race.setTrack("Bahrain International Circuit");
        race.setWeather("Rainy");
        race.setStatus(RaceStatus.OPEN);

        Race updatedRace = new Race();
        updatedRace.setId(1L);
        updatedRace.setName("Bahrain GP");
        updatedRace.setDate(LocalDate.of(2024, 3, 2));
        updatedRace.setTrack("Bahrain International Circuit");
        updatedRace.setWeather("Rainy");
        updatedRace.setStatus(RaceStatus.CLOSED);

        // Mock: save() gibt aktualisiertes Rennen zurück
        when(raceRepository.save(any(Race.class))).thenReturn(updatedRace);

        Race result = raceService.updateRace(race);

        // Prüfen, dass Status korrekt aktualisiert wurde
        assertNotNull(result);
        assertEquals(RaceStatus.CLOSED, result.getStatus());

        verify(raceRepository, times(1)).save(any(Race.class));
    }

    @Test
    void testGetAllRaces() {
        // Testet Abruf aller Rennen
        Race race1 = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.OPEN);
        race1.setId(1L);

        Race race2 = new Race("Saudi Arabian GP", LocalDate.of(2024, 3, 9),
                "Jeddah Corniche Circuit", "Clear", RaceStatus.TIPPABLE);
        race2.setId(2L);

        List<Race> races = Arrays.asList(race1, race2);
        when(raceRepository.findAll()).thenReturn(races);

        List<Race> result = raceService.getAllRaces();

        // Prüfen, dass beide Rennen zurückgegeben werden
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Bahrain GP", result.get(0).getName());
        assertEquals("Saudi Arabian GP", result.get(1).getName());

        verify(raceRepository, times(1)).findAll();
    }

    @Test
    void testGetRaceById() {
        // Testet Abruf eines Rennens nach ID (existierend)
        Race race = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.OPEN);

        when(raceRepository.findById(1L)).thenReturn(Optional.of(race));

        Optional<Race> result = raceService.getRaceById(1L);

        // Prüfen, dass Rennen korrekt zurückgegeben wird
        assertTrue(result.isPresent());
        assertEquals("Bahrain GP", result.get().getName());
        assertEquals("Bahrain International Circuit", result.get().getTrack());
        assertEquals(RaceStatus.OPEN, result.get().getStatus());

        verify(raceRepository, times(1)).findById(1L);
    }

    @Test
    void testGetRaceByIdNotFound() {
        // Testet Abruf eines Rennens nach ID, die nicht existiert
        when(raceRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Race> result = raceService.getRaceById(999L);

        // Prüfen, dass kein Rennen zurückgegeben wird
        assertFalse(result.isPresent());
        verify(raceRepository, times(1)).findById(999L);
    }

    @Test
    void testDeleteRace() {
        // Testet Löschen eines Rennens nach ID
        doNothing().when(raceRepository).deleteById(1L);

        raceService.deleteRace(1L);

        // Sicherstellen, dass Repository.deleteById genau einmal aufgerufen wurde
        verify(raceRepository, times(1)).deleteById(1L);
    }

    /*
     * Zusammenfassung:
     * Diese Testklasse prüft alle Kernfunktionen des RaceService:
     * 1. testCreateRace: Speichern eines neuen Rennens
     * 2. testUpdateRace: Aktualisieren eines bestehenden Rennens
     * 3. testGetAllRaces: Abrufen aller Rennen
     * 4. testGetRaceById: Abrufen eines existierenden Rennens nach ID
     * 5. testGetRaceByIdNotFound: Verhalten bei nicht existierender ID
     * 6. testDeleteRace: Löschen eines Rennens nach ID
     *
     * Die Tests verwenden Mockito-Mocks für das Repository und überprüfen:
     * - Korrekte Rückgabe der Objekte
     * - Aufruf der richtigen Repository-Methoden
     * - Verhalten bei leeren oder nicht vorhandenen Daten
     */
}
