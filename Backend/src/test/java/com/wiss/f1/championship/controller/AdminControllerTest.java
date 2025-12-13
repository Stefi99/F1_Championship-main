package com.wiss.f1.championship.controller;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.entity.RaceStatus;
import com.wiss.f1.championship.service.RaceService;

/**
 * Unit-Tests für Admin-Controller-Komponenten (RaceController und AdminTestController).
 *
 * Testfälle:
 * - Abrufen aller Rennen
 * - Abrufen eines Rennens nach ID (inkl. Nicht gefunden)
 * - Erstellen, Aktualisieren, Löschen von Rennen
 * - Admin-Test-Endpunkt
 */
class AdminControllerTest {

    private RaceService raceService;
    private RaceController raceController;

    private Race testRace1;
    private Race testRace2;

    @BeforeEach
    void setUp() {
        raceService = mock(RaceService.class); // Mock für Service
        raceController = new RaceController(raceService); // Controller mit Mock

        // Beispielrennen erstellen
        testRace1 = new Race("Bahrain GP", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Sunny", RaceStatus.OPEN);
        testRace1.setId(1L);

        testRace2 = new Race("Saudi Arabian GP", LocalDate.of(2024, 3, 9),
                "Jeddah Corniche Circuit", "Clear", RaceStatus.TIPPABLE);
        testRace2.setId(2L);
    }

    @Test
    void testGetAllRaces() {
        // Setup Mock
        List<Race> races = Arrays.asList(testRace1, testRace2);
        when(raceService.getAllRaces()).thenReturn(races);

        // Test
        List<Race> result = raceController.getAllRaces();

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Bahrain GP", result.get(0).getName());
        assertEquals("Saudi Arabian GP", result.get(1).getName());

        // Verify Service-Aufruf
        verify(raceService, times(1)).getAllRaces();
    }

    @Test
    void testGetRaceByIdNotFound() {
        when(raceService.getRaceById(999L)).thenReturn(Optional.empty());

        Race result = raceController.getRaceById(999L);

        assertNull(result);
        verify(raceService, times(1)).getRaceById(999L);
    }

    @Test
    void testCreateRace() {
        Race newRace = new Race("Monaco GP", LocalDate.of(2024, 5, 26),
                "Circuit de Monaco", "Sunny", RaceStatus.OPEN);
        newRace.setId(3L);

        when(raceService.createRace(any(Race.class))).thenReturn(newRace);

        Race result = raceController.createRace(newRace);

        assertNotNull(result);
        assertEquals("Monaco GP", result.getName());
        assertEquals("Circuit de Monaco", result.getTrack());
        assertEquals(RaceStatus.OPEN, result.getStatus());
        verify(raceService, times(1)).createRace(any(Race.class));
    }

    @Test
    void testUpdateRace() {
        Race updatedRace = new Race("Bahrain GP Updated", LocalDate.of(2024, 3, 2),
                "Bahrain International Circuit", "Rainy", RaceStatus.CLOSED);
        updatedRace.setId(1L);

        when(raceService.updateRace(any(Race.class))).thenReturn(updatedRace);

        Race result = raceController.updateRace(1L, updatedRace);

        assertNotNull(result);
        assertEquals("Bahrain GP Updated", result.getName());
        assertEquals("Rainy", result.getWeather());
        assertEquals(RaceStatus.CLOSED, result.getStatus());
        verify(raceService, times(1)).updateRace(any(Race.class));
    }

    @Test
    void testDeleteRace() {
        doNothing().when(raceService).deleteRace(1L);

        raceController.deleteRace(1L);

        verify(raceService, times(1)).deleteRace(1L);
    }

    @Test
    void testAdminTestEndpoint() {
        AdminTestController adminTestController = new AdminTestController();
        String result = adminTestController.adminTest();

        assertEquals("Admin ok!", result);
    }
}

/*
 * Zusammenfassung:
 * AdminControllerTest testet die Kernfunktionen der Admin-Controller:
 * - RaceController: CRUD-Operationen für Rennen, inklusive Abrufen, Erstellen, Aktualisieren und Löschen.
 * - AdminTestController: Einfacher Test-Endpunkt für Admins.
 *
 * Mockito wird verwendet, um RaceService zu mocken, sodass die Controller-Logik isoliert getestet werden kann.
 */
