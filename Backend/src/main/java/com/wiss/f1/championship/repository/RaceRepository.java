package com.wiss.f1.championship.repository;

import com.wiss.f1.championship.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository für Race-Entitäten.
 * Bietet Zugriff auf die "races"-Tabelle.
 * Erweitert JpaRepository für Standard-CRUD-Operationen.
 */
@Repository
public interface RaceRepository extends JpaRepository<Race, Long> {
}

/*
 * Zusammenfassung:
 * Dieses Interface stellt die Datenzugriffsschicht für Race bereit.
 * Durch das Erweitern von JpaRepository sind Standardmethoden wie
 * save, findById, findAll, deleteById automatisch verfügbar.
 */
