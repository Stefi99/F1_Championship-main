package com.wiss.f1.championship.repository;

import com.wiss.f1.championship.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository für Driver-Entitäten.
 * Bietet CRUD-Operationen sowie Abfragen basierend auf dem Fahrernamen.
 */
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    /**
     * Findet einen Fahrer anhand des Namens.
     * @param name Name des Fahrers
     * @return Optional<Driver>
     */
    Optional<Driver> findByName(String name);
}

/*
 * Zusammenfassung:
 * Dieses Interface ermöglicht den Zugriff auf die "drivers"-Tabelle.
 * Es erbt die Standard-CRUD-Methoden von JpaRepository und stellt zusätzlich
 * eine Methode bereit, um einen Fahrer anhand seines Namens zu suchen.
 */
