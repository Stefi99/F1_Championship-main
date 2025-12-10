package com.wiss.f1.championship.service;
import com.wiss.f1.championship.entity.Driver;
import com.wiss.f1.championship.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    /**
     * Gibt alle Fahrer sortiert nach Name zurück.
     * @return Liste aller Fahrer mit Name und Team-Informationen
     */
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll().stream()
                .sorted(Comparator.comparing(Driver::getName))
                .collect(Collectors.toList());
    }

    public Optional<Driver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public Driver updateDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }

    public Optional<Driver> getDriverByName(String name) {
        return driverRepository.findByName(name);
    }
}
