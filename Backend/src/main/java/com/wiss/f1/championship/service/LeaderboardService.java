package com.wiss.f1.championship.service;

import com.wiss.f1.championship.dto.LeaderboardDTO;
import com.wiss.f1.championship.entity.*;
import com.wiss.f1.championship.repository.AppUserRepository;
import com.wiss.f1.championship.repository.OfficialResultRepository;
import com.wiss.f1.championship.repository.RaceRepository;
import com.wiss.f1.championship.repository.TipRepository;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Service zur Berechnung und Bereitstellung des Leaderboards.
 *
 * Aufgaben:
 * - Gesamtpunkte aller User berechnen
 * - Rangliste nach Punkten erstellen
 * - Punkteberechnung pro Rennen nach Regeln:
 *      * Richtige Position: Podium 5 Punkte, Top10 3 Punkte
 *      * Falsche Position, aber Top10: Podium 2 Punkte, Top10 1 Punkt
 *
 * Verwendet Repositories für AppUser, Race, Tip und OfficialResult.
 */
@Service
public class LeaderboardService {

    private final AppUserRepository appUserRepository;
    private final TipRepository tipRepository;
    private final RaceRepository raceRepository;
    private final OfficialResultRepository officialResultRepository;

    public LeaderboardService(AppUserRepository appUserRepository,
                              TipRepository tipRepository,
                              RaceRepository raceRepository,
                              OfficialResultRepository officialResultRepository) {
        this.appUserRepository = appUserRepository;
        this.tipRepository = tipRepository;
        this.raceRepository = raceRepository;
        this.officialResultRepository = officialResultRepository;
    }

    /**
     * Erstellt das gesamte Leaderboard.
     * @return Liste von LeaderboardDTOs mit Username, DisplayName, Punkte und Rang
     */
    public List<LeaderboardDTO> getLeaderboard() {

        List<AppUser> users = appUserRepository.findAll();
        List<Race> races = raceRepository.findAll();

        List<LeaderboardDTO> leaderboard = new ArrayList<>();

        for (AppUser user : users) {

            int totalPoints = 0;

            for (Race race : races) {
                System.out.println("Checking race " + race.getName());
                // Nur geschlossene Rennen berücksichtigen
                if (race.getStatus() != RaceStatus.CLOSED) continue;

                System.out.println("Race isnt closed");
                // Tipps des Users für dieses Rennen

                List<Tip> userTips = tipRepository.findByUserIdAndRaceId(user.getId(), race.getId());
                if (userTips.isEmpty()) continue;

                System.out.println("Tips arent empty");

                System.out.println("Checking official results");
                // Offizielle Ergebnisse

                List<OfficialResult> results = officialResultRepository.findByRaceId(race.getId());
                if (results.isEmpty()) continue;

                // Maps für Positionsvergleich
                Map<Integer, Long> officialPosMap = new HashMap<>();
                for (OfficialResult r : results) {
                    officialPosMap.put(r.getFinalPosition(), r.getDriver().getId());
                }

                Map<Integer, Long> predictedPosMap = new HashMap<>();
                for (Tip t : userTips) {
                    predictedPosMap.put(t.getPredictedPosition(), t.getDriver().getId());
                }

                System.out.println("Calculating race points");

                totalPoints += calculateRacePoints(predictedPosMap, officialPosMap);
            }

            leaderboard.add(new LeaderboardDTO(
                    user.getUsername(),
                    user.getDisplayName() != null ? user.getDisplayName() : user.getUsername(),
                    totalPoints,
                    0 // Rang wird später gesetzt
            ));
        }

        // Nach Punkten absteigend sortieren
        leaderboard.sort(Comparator.comparingInt(LeaderboardDTO::getPoints).reversed());

        // Rang setzen
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }

    /**
     * Berechnet Punkte für ein Rennen anhand der Vorhersage und offiziellen Ergebnisse.
     * @param predicted Map: Vorhergesagte Position → DriverId
     * @param official Map: Offizielle Position → DriverId
     * @return Punkte für dieses Rennen
     */
    private int calculateRacePoints(Map<Integer, Long> predicted, Map<Integer, Long> official) {

        int points = 0;

        for (int pos = 1; pos <= 10; pos++) {

            Long predictedDriver = predicted.get(pos);
            Long correctDriver = official.get(pos);

            if (predictedDriver == null || correctDriver == null) continue;

            // Richtige Position
            if (Objects.equals(predictedDriver, correctDriver)) {
                if (pos <= 3) points += 5;      // Podium korrekt
                else points += 3;                // Top10 korrekt
                continue;
            }

            // Fahrer im Top10, aber falsche Position
            boolean isInTop10 = official.values().contains(predictedDriver);

            if (isInTop10) {
                if (pos <= 3) points += 2;      // Podium, falsche Position
                else points += 1;                // Top10, falsche Position
            }
        }

        return points;
    }

    /**
     * Berechnet die Gesamtpunkte eines einzelnen Users.
     * @param user Der User
     * @return Gesamtpunkte über alle geschlossenen Rennen
     */
    public int calculateUserPoints(AppUser user) {
        List<Race> races = raceRepository.findAll();
        int totalPoints = 0;

        for (Race race : races) {
            if (race.getStatus() != RaceStatus.CLOSED) continue;

            if (!"CLOSED".equalsIgnoreCase(race.getStatus().name())) continue;

            List<Tip> userTips = tipRepository.findByUserIdAndRaceId(user.getId(), race.getId());
            if (userTips.isEmpty()) continue;

            List<OfficialResult> results = officialResultRepository.findByRaceId(race.getId());
            if (results.isEmpty()) continue;

            Map<Integer, Long> officialPosMap = new HashMap<>();
            for (OfficialResult r : results) {
                officialPosMap.put(r.getFinalPosition(), r.getDriver().getId());
            }

            Map<Integer, Long> predictedPosMap = new HashMap<>();
            for (Tip t : userTips) {
                predictedPosMap.put(t.getPredictedPosition(), t.getDriver().getId());
            }

            totalPoints += calculateRacePoints(predictedPosMap, officialPosMap);
        }

        return totalPoints;
    }
}

/*
 * Zusammenfassung:
 * LeaderboardService erstellt das Ranking aller Spieler basierend auf deren Tipps und den offiziellen
 * Rennergebnissen. Punkte werden pro Rennen berechnet, wobei richtige Positionen und Top10-Treffer
 * unterschiedlich gewertet werden. Zusätzlich kann man die Punkte eines einzelnen Users abrufen.
 * Alle Berechnungen berücksichtigen nur geschlossene Rennen (RaceStatus.CLOSED).
 */
