package com.wiss.f1.championship.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wiss.f1.championship.entity.AppUser;

/**
 * Repository für AppUser-Entitäten.
 * Bietet CRUD-Operationen sowie spezifische Abfragen für Benutzer.
 */
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    /**
     * Findet einen Benutzer anhand des Benutzernamens.
     * @param username Benutzername
     * @return Optional<AppUser>
     */
    Optional<AppUser> findByUsername(String username);

    /**
     * Findet einen Benutzer anhand der Email-Adresse.
     * @param email Email-Adresse
     * @return Optional<AppUser>
     */
    Optional<AppUser> findByEmail(String email);

    /**
     * Prüft, ob ein Benutzername bereits existiert.
     * @param username Benutzername
     * @return true, wenn vorhanden
     */
    boolean existsByUsername(String username);

    /**
     * Prüft, ob eine Email-Adresse bereits existiert.
     * @param email Email-Adresse
     * @return true, wenn vorhanden
     */
    boolean existsByEmail(String email);
}

/*
 * Zusammenfassung:
 * Dieses Interface ermöglicht die Interaktion mit der AppUser-Datenbanktabelle.
 * Es erweitert JpaRepository, wodurch CRUD-Methoden automatisch verfügbar sind,
 * und definiert zusätzliche Abfragen für Benutzername und Email sowie deren Existenzprüfungen.
 */
