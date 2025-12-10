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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.wiss.f1.championship.entity.Driver;
import com.wiss.f1.championship.entity.OfficialResult;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.entity.RaceStatus;
import com.wiss.f1.championship.repository.OfficialResultRepository;
import com.wiss.f1.championship.service.OfficialResultService;

class OfficialResultServiceTest {

    private OfficialResultRepository resultRepository;
    private OfficialResultService resultService;

    @BeforeEach
    void setUp() {
        resultRepository = mock(OfficialResultRepository.class);
        resultService = new OfficialResultService(resultRepository);
    }

    @Test
    void testCreateResult() {
        Race race = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.CLOSED);
        Driver driver = new Driver("Max Verstappen", "Red Bull Racing");
        OfficialResult result = new OfficialResult(race, driver, 1);

        when(resultRepository.save(any(OfficialResult.class))).thenReturn(result);

        OfficialResult saved = resultService.createResult(result);

        assertNotNull(saved);
        assertEquals(1, saved.getFinalPosition());
        assertEquals("Max Verstappen", saved.getDriver().getName());
        assertEquals("Bahrain GP", saved.getRace().getName());
        verify(resultRepository, times(1)).save(any(OfficialResult.class));
    }

    @Test
    void testGetById() {
        Race race = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.CLOSED);
        Driver driver = new Driver("Max Verstappen", "Red Bull Racing");
        OfficialResult result = new OfficialResult(race, driver, 1);

        when(resultRepository.findById(1L)).thenReturn(Optional.of(result));

        Optional<OfficialResult> found = resultService.getById(1L);

        assertTrue(found.isPresent());
        assertEquals(1, found.get().getFinalPosition());
        assertEquals("Max Verstappen", found.get().getDriver().getName());
        verify(resultRepository, times(1)).findById(1L);
    }

    @Test
    void testGetByIdNotFound() {
        when(resultRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<OfficialResult> result = resultService.getById(999L);

        assertFalse(result.isPresent());
        verify(resultRepository, times(1)).findById(999L);
    }

    @Test
    void testGetResultsForRace() {
        Race race = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.CLOSED);
        
        Driver driver1 = new Driver("Max Verstappen", "Red Bull Racing");
        Driver driver2 = new Driver("Lewis Hamilton", "Mercedes");
        
        OfficialResult result1 = new OfficialResult(race, driver1, 1);
        OfficialResult result2 = new OfficialResult(race, driver2, 2);

        List<OfficialResult> results = Arrays.asList(result1, result2);
        when(resultRepository.findByRace(eq(race))).thenReturn(results);

        List<OfficialResult> found = resultService.getResultsForRace(race);

        assertNotNull(found);
        assertEquals(2, found.size());
        assertEquals(1, found.get(0).getFinalPosition());
        assertEquals(2, found.get(1).getFinalPosition());
        assertEquals("Max Verstappen", found.get(0).getDriver().getName());
        assertEquals("Lewis Hamilton", found.get(1).getDriver().getName());
        verify(resultRepository, times(1)).findByRace(eq(race));
    }

    @Test
    void testGetResultsForRaceEmpty() {
        Race race = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.CLOSED);

        when(resultRepository.findByRace(eq(race))).thenReturn(Arrays.asList());

        List<OfficialResult> found = resultService.getResultsForRace(race);

        assertNotNull(found);
        assertTrue(found.isEmpty());
        verify(resultRepository, times(1)).findByRace(eq(race));
    }

    @Test
    void testDeleteResult() {
        doNothing().when(resultRepository).deleteById(1L);

        resultService.deleteResult(1L);

        verify(resultRepository, times(1)).deleteById(1L);
    }
}

