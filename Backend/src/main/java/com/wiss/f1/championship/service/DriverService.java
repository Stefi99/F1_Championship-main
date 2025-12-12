package com.wiss.f1.championship.service;

import com.wiss.f1.championship.entity.Driver;
import com.wiss.f1.championship.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service-Klasse für die Verwaltung von Driver-Entitäten.
 *
 * Verantwortlich für:
 * - Abruf von Fahrern
 * - Erstellen, Aktualisieren und Löschen von Fahrern
 * - Sortierung von Fahrern nach Name
 */
@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    /**
     * Gibt alle Fahrer zurück, sortiert nach Namen.
     * @return Liste aller Fahrer
     */
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll().stream()
                .sorted(Comparator.comparing(Driver::getName))
                .collect(Collectors.toList());
    }

    /**
     * Sucht einen Fahrer anhand der ID.
     * @param id Fahrer-ID
     * @return Optional mit Driver oder empty wenn nicht gefunden
     */
    public Optional<Driver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }

    /**
     * Legt einen neuen Fahrer an.
     * @param driver Fahrerobjekt
     * @return Gespeicherter Fahrer
     */
    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    /**
     * Aktualisiert einen bestehenden Fahrer.
     * @param driver Fahrerobjekt
     * @return Aktualisierter Fahrer
     */
    public Driver updateDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    /**
     * Löscht einen Fahrer anhand der ID.
     * @param id Fahrer-ID
     */
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }

    /**
     * Sucht einen Fahrer anhand des Namens.
     * @param name Fahrername
     * @return Optional mit Driver oder empty wenn nicht gefunden
     */
    public Optional<Driver> getDriverByName(String name) {
        return driverRepository.findByName(name);
    }
}

/*
 * Zusammenfassung:
 * DriverService kapselt die gesamte Business-Logik rund um Fahrer.
 * Es werden CRUD-Operationen bereitgestellt (Create, Read, Update, Delete),
 * sowie zusätzliche Funktionalitäten wie Sortierung nach Name und Suche nach Name.
 *
 * Repository-Zugriffe werden abstrahiert, sodass Controller und andere Services
 * die Fahrerverwaltung einfach nutzen können.
 */
