package com.wiss.f1.championship.service;
import com.wiss.f1.championship.dto.TipResponseDTO;
import com.wiss.f1.championship.entity.*;
import com.wiss.f1.championship.repository.TipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
     * Konvertiert das Array-Format (List<String> order) in einzelne Tip-Objekte.
     * 
     * @param user Der User, der den Tipp abgibt
     * @param race Das Rennen, für das getippt wird
     * @param driverNames Liste der Fahrernamen in der Reihenfolge 1-10
     * @return Liste der gespeicherten Tip-Objekte
     */
    @Transactional
    public List<Tip> saveOrUpdateTip(AppUser user, Race race, List<String> driverNames) {
        // Alte Tipps für diesen User und dieses Rennen löschen
        List<Tip> existingTips = tipRepository.findByUserIdAndRaceId(user.getId(), race.getId());
        tipRepository.deleteAll(existingTips);

        // Neue Tipps erstellen
        List<Tip> newTips = new ArrayList<>();
        
        for (int i = 0; i < driverNames.size() && i < 10; i++) {
            String driverName = driverNames.get(i);
            if (driverName == null || driverName.trim().isEmpty()) {
                continue; // Überspringe leere Einträge
            }

            // Fahrer nach Namen finden
            Optional<Driver> driverOpt = driverService.getDriverByName(driverName);
            if (driverOpt.isEmpty()) {
                throw new IllegalArgumentException("Fahrer nicht gefunden: " + driverName);
            }

            Driver driver = driverOpt.get();
            int position = i + 1; // Position 1-10

            Tip tip = new Tip(user, race, driver, position);
            newTips.add(tip);
        }

        // Alle neuen Tipps speichern
        return tipRepository.saveAll(newTips);
    }

    /**
     * Holt den Tipp eines Users für ein Rennen im Array-Format.
     * 
     * @param user Der User
     * @param race Das Rennen
     * @return Liste der Fahrernamen in der Reihenfolge 1-10, oder leere Liste wenn kein Tipp vorhanden
     */
    public List<String> getTipOrderForUserAndRace(AppUser user, Race race) {
        List<Tip> tips = tipRepository.findByUserIdAndRaceId(user.getId(), race.getId());
        
        if (tips.isEmpty()) {
            return new ArrayList<>();
        }

        // Sortiere nach Position und extrahiere Fahrernamen
        return tips.stream()
                .sorted((t1, t2) -> Integer.compare(t1.getPredictedPosition(), t2.getPredictedPosition()))
                .map(tip -> tip.getDriver().getName())
                .collect(Collectors.toList());
    }

    /**
     * Holt alle Tipps eines Users im Array-Format gruppiert nach Rennen.
     * 
     * @param user Der User
     * @return Map von raceId zu Liste der Fahrernamen
     */
    public List<TipResponseDTO> getAllTipsForUser(AppUser user) {
        List<Tip> allTips = tipRepository.findByUser(user);
        
        // Gruppiere nach Rennen
        return allTips.stream()
                .collect(Collectors.groupingBy(Tip::getRace))
                .entrySet().stream()
                .map(entry -> {
                    Race race = entry.getKey();
                    List<String> order = entry.getValue().stream()
                            .sorted((t1, t2) -> Integer.compare(t1.getPredictedPosition(), t2.getPredictedPosition()))
                            .map(tip -> tip.getDriver().getName())
                            .collect(Collectors.toList());
                    return new TipResponseDTO(race.getId(), order);
                })
                .collect(Collectors.toList());
    }
}
