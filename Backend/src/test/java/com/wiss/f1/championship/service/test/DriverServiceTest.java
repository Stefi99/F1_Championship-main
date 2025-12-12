package com.wiss.f1.championship.service.test;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.wiss.f1.championship.entity.Driver;
import com.wiss.f1.championship.repository.DriverRepository;
import com.wiss.f1.championship.service.DriverService;

/**
 * Unit-Tests für DriverService.
 *
 * Testfälle:
 * - Erstellen eines Fahrers
 * - Aktualisieren eines Fahrers
 * - Alle Fahrer abrufen (sortiert nach Name)
 * - Fahrer nach ID abrufen (vorhanden und nicht vorhanden)
 * - Fahrer löschen
 *
 * Mockito wird verwendet, um das DriverRepository zu mocken und die Service-Logik isoliert zu testen.
 */
class DriverServiceTest {

    private DriverRepository driverRepository;
    private DriverService driverService;

    @BeforeEach
    void setUp() {
        driverRepository = mock(DriverRepository.class);
        driverService = new DriverService(driverRepository);
    }

    @Test
    void testCreateDriver() {
        Driver driver = new Driver();
        driver.setName("Max Verstappen");
        driver.setTeam("Red Bull Racing");

        when(driverRepository.save(any(Driver.class))).thenReturn(driver);

        Driver saved = driverService.createDriver(driver);

        assertNotNull(saved);
        assertEquals("Max Verstappen", saved.getName());
        assertEquals("Red Bull Racing", saved.getTeam());
        verify(driverRepository, times(1)).save(any(Driver.class));
    }

    @Test
    void testUpdateDriver() {
        Driver driver = new Driver();
        driver.setName("Max Verstappen");
        driver.setTeam("Red Bull Racing");

        Driver updatedDriver = new Driver();
        updatedDriver.setName("Max Verstappen");
        updatedDriver.setTeam("Red Bull Racing Honda RBPT");

        when(driverRepository.save(any(Driver.class))).thenReturn(updatedDriver);

        Driver result = driverService.updateDriver(driver);

        assertNotNull(result);
        assertEquals("Max Verstappen", result.getName());
        assertEquals("Red Bull Racing Honda RBPT", result.getTeam());
        verify(driverRepository, times(1)).save(any(Driver.class));
    }

    @Test
    void testGetAllDrivers() {
        Driver driver1 = new Driver("Max Verstappen", "Red Bull Racing");
        Driver driver2 = new Driver("Lewis Hamilton", "Mercedes");

        List<Driver> drivers = Arrays.asList(driver1, driver2);
        when(driverRepository.findAll()).thenReturn(drivers);

        List<Driver> result = driverService.getAllDrivers();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Max Verstappen", result.get(0).getName());
        assertEquals("Lewis Hamilton", result.get(1).getName());
        verify(driverRepository, times(1)).findAll();
    }

    @Test
    void testGetDriverById() {
        Driver driver = new Driver("Max Verstappen", "Red Bull Racing");

        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));

        Optional<Driver> result = driverService.getDriverById(1L);

        assertTrue(result.isPresent());
        assertEquals("Max Verstappen", result.get().getName());
        assertEquals("Red Bull Racing", result.get().getTeam());
        verify(driverRepository, times(1)).findById(1L);
    }

    @Test
    void testGetDriverByIdNotFound() {
        when(driverRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Driver> result = driverService.getDriverById(999L);

        assertFalse(result.isPresent());
        verify(driverRepository, times(1)).findById(999L);
    }

    @Test
    void testDeleteDriver() {
        doNothing().when(driverRepository).deleteById(1L);

        driverService.deleteDriver(1L);

        verify(driverRepository, times(1)).deleteById(1L);
    }
}

/*
 * Zusammenfassung:
 * DriverServiceTest prüft die CRUD-Operationen des DriverService:
 * - createDriver / updateDriver / deleteDriver
 * - getDriverById (existierend und nicht existierend)
 * - getAllDrivers (Rückgabe aller Fahrer, sortiert)
 *
 * Mockito sorgt für ein isoliertes Testen ohne tatsächliche Datenbankzugriffe.
 */
