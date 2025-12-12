package com.wiss.f1.championship.service;

import com.wiss.f1.championship.dto.TipResponseDTO;
import com.wiss.f1.championship.entity.*;
import com.wiss.f1.championship.repository.TipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service für Tipps (Tip).
 *
 * Aufgaben:
 * - Tipps erstellen, abrufen, löschen
 * - Prüfen, ob ein User bereits getippt hat
 * - Konvertierung zwischen Array-Format (Liste von Fahrernamen) und Tip-Objekten
 * - Bereitstellung von Tipps eines Users in DTO-Form für Frontend
 */
@Service
public class TipService {

    private final TipRepository tipRepository;
    private final DriverService driverService;

    public TipService(TipRepository tipRepository, DriverService driverService) {
        this.tipRepository = tipRepository;
        this.driverService = driverService;
    }

    public Optional<Tip> getTipById(Long id) {
        return tipRepository.findById(id);
    }

    public List<Tip> getTipsByUser(AppUser user) {
        return tipRepository.findByUser(user);
    }

    public List<Tip> getTipsByRace(Race race) {
        return tipRepository.findByRace(race);
    }

    public Tip createTip(Tip tip) {
        return tipRepository.save(tip);
    }

    public void deleteTip(Long id) {
        tipRepository.deleteById(id);
    }

    public boolean hasUserAlreadyTipped(AppUser user, Race race) {
        return tipRepository.existsByUserAndRace(user, race);
    }

    /**
     * Speichert oder aktualisiert einen Tipp für einen User und ein Rennen.
     * Alte Tipps werden gelöscht und neue aus der Reihenfolge von Fahrernamen erstellt.
     *
     * @param user Der User, der den Tipp abgibt
     * @param race Das Rennen, für das getippt wird
     * @param driverNames Liste der Fahrernamen in der Reihenfolge 1-10
     * @return Liste der gespeicherten Tip-Objekte
     */
    @Transactional
    public List<Tip> saveOrUpdateTip(AppUser user, Race race, List<String> driverNames) {
        // Alte Tipps löschen
        List<Tip> existingTips = tipRepository.findByUserIdAndRaceId(user.getId(), race.getId());
        tipRepository.deleteAll(existingTips);

        List<Tip> newTips = new ArrayList<>();

        for (int i = 0; i < driverNames.size() && i < 10; i++) {
            String driverName = driverNames.get(i);
            if (driverName == null || driverName.trim().isEmpty()) continue;

            Optional<Driver> driverOpt = driverService.getDriverByName(driverName);
            if (driverOpt.isEmpty()) {
                throw new IllegalArgumentException("Fahrer nicht gefunden: " + driverName);
            }

            int position = i + 1; // Position 1-10
            newTips.add(new Tip(user, race, driverOpt.get(), position, LocalDateTime.now()));
        }

        return tipRepository.saveAll(newTips);
    }

    /**
     * Holt den Tipp eines Users für ein Rennen im Array-Format.
     *
     * @param user Der User
     * @param race Das Rennen
     * @return Liste der Fahrernamen in der Reihenfolge 1-10, oder leere Liste
     */
    public List<String> getTipOrderForUserAndRace(AppUser user, Race race) {
        List<Tip> tips = tipRepository.findByUserIdAndRaceId(user.getId(), race.getId());
        if (tips.isEmpty()) return new ArrayList<>();

        return tips.stream()
                .sorted(Comparator.comparingInt(Tip::getPredictedPosition))
                .map(tip -> tip.getDriver().getName())
                .collect(Collectors.toList());
    }

    /**
     * Holt alle Tipps eines Users in DTO-Form, gruppiert nach Rennen.
     *
     * @param user Der User
     * @return Liste von TipResponseDTO mit Rennen-ID, Reihenfolge und UpdatedAt
     */
    public List<TipResponseDTO> getAllTipsForUser(AppUser user) {
        List<Tip> allTips = tipRepository.findByUser(user);

        return allTips.stream()
                .collect(Collectors.groupingBy(Tip::getRace))
                .entrySet().stream()
                .map(entry -> {
                    Race race = entry.getKey();
                    List<Tip> raceTips = entry.getValue();
                    List<String> order = raceTips.stream()
                            .sorted(Comparator.comparingInt(Tip::getPredictedPosition))
                            .map(t -> t.getDriver().getName())
                            .collect(Collectors.toList());

                    LocalDateTime updatedAt = raceTips.get(0).getUpdatedAt();
                    return new TipResponseDTO(race.getId(), order, updatedAt);
                })
                .collect(Collectors.toList());
    }

    /**
     * Holt das Datum der letzten Tipp-Aktualisierung für einen User und ein Rennen.
     *
     * @param user Der User
     * @param race Das Rennen
     * @return LocalDateTime der letzten Aktualisierung oder jetzt, falls kein Tipp vorhanden
     */
    public LocalDateTime getTipUpdatedAtForUserAndRace(AppUser user, Race race) {
        List<Tip> tips = tipRepository.findByUserIdAndRaceId(user.getId(), race.getId());
        if (tips.isEmpty()) return LocalDateTime.now();
        return tips.get(0).getUpdatedAt();
    }
}

/*
 * Zusammenfassung:
 * TipService verwaltet die Tipps der Nutzer für Rennen.
 * Es bietet Methoden zum Erstellen, Aktualisieren, Abrufen und Löschen von Tipps.
 * Tipps werden in einzelne Tip-Objekte konvertiert, die Position und Fahrer enthalten.
 * Zusätzlich werden die Tipps in array-freundliche DTOs umgewandelt, die für Frontend oder API-Ausgabe geeignet sind.
 */
