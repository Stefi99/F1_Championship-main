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
        raceRepository = mock(RaceRepository.class);
        raceService = new RaceService(raceRepository);
    }

    @Test
    void testCreateRace() {
        Race race = new Race();
        race.setName("Bahrain GP");
        race.setDate(LocalDate.of(2024, 3, 2));
        race.setTrack("Bahrain International Circuit");
        race.setWeather("Sunny");
        race.setStatus(RaceStatus.OPEN);

        when(raceRepository.save(any(Race.class))).thenReturn(race);

        Race saved = raceService.createRace(race);

        assertNotNull(saved);
        assertEquals("Bahrain GP", saved.getName());
        assertEquals(RaceStatus.OPEN, saved.getStatus());
        verify(raceRepository, times(1)).save(any(Race.class));
    }

    @Test
    void testUpdateRace() {
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

        when(raceRepository.save(any(Race.class))).thenReturn(updatedRace);

        Race result = raceService.updateRace(race);

        assertNotNull(result);
        assertEquals(RaceStatus.CLOSED, result.getStatus());
        verify(raceRepository, times(1)).save(any(Race.class));
    }

    @Test
    void testGetAllRaces() {
        Race race1 = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.OPEN);
        race1.setId(1L);

        Race race2 = new Race("Saudi Arabian GP", LocalDate.of(2024, 3, 9),
                "Jeddah Corniche Circuit", "Clear", RaceStatus.TIPPABLE);
        race2.setId(2L);

        List<Race> races = Arrays.asList(race1, race2);
        when(raceRepository.findAll()).thenReturn(races);

        List<Race> result = raceService.getAllRaces();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Bahrain GP", result.get(0).getName());
        assertEquals("Saudi Arabian GP", result.get(1).getName());
        verify(raceRepository, times(1)).findAll();
    }

    @Test
    void testGetRaceById() {
        Race race = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.OPEN);

        when(raceRepository.findById(1L)).thenReturn(Optional.of(race));

        Optional<Race> result = raceService.getRaceById(1L);

        assertTrue(result.isPresent());
        assertEquals("Bahrain GP", result.get().getName());
        assertEquals("Bahrain International Circuit", result.get().getTrack());
        assertEquals(RaceStatus.OPEN, result.get().getStatus());
        verify(raceRepository, times(1)).findById(1L);
    }

    @Test
    void testGetRaceByIdNotFound() {
        when(raceRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Race> result = raceService.getRaceById(999L);

        assertFalse(result.isPresent());
        verify(raceRepository, times(1)).findById(999L);
    }

    @Test
    void testDeleteRace() {
        doNothing().when(raceRepository).deleteById(1L);

        raceService.deleteRace(1L);

        verify(raceRepository, times(1)).deleteById(1L);
    }
}
