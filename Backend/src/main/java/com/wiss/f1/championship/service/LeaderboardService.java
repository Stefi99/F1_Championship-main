package com.wiss.f1.championship.service;

import com.wiss.f1.championship.dto.LeaderboardDTO;
import com.wiss.f1.championship.entity.*;
import com.wiss.f1.championship.repository.AppUserRepository;
import com.wiss.f1.championship.repository.OfficialResultRepository;
import com.wiss.f1.championship.repository.RaceRepository;
import com.wiss.f1.championship.repository.TipRepository;
import org.springframework.stereotype.Service;

import java.util.*;

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

    public List<LeaderboardDTO> getLeaderboard() {

        List<AppUser> users = appUserRepository.findAll();
        List<Race> races = raceRepository.findAll();

        List<LeaderboardDTO> leaderboard = new ArrayList<>();

        for (AppUser user : users) {

            int totalPoints = 0;

            for (Race race : races) {

                System.out.println("Checking race " + race.getName());
                // Nur geschlossene Rennen zählen
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

                // Map: finalPosition → driverId
                Map<Integer, Long> officialPosMap = new HashMap<>();
                for (OfficialResult r : results) {
                    officialPosMap.put(r.getFinalPosition(), r.getDriver().getId());
                }

                // Map: predictedPosition → driverId
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
                    0
            ));
        }

        // Sortieren
        leaderboard.sort(Comparator.comparingInt(LeaderboardDTO::getPoints).reversed());

        // Rank setzen
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }

    // Punkteberechnung
    private int calculateRacePoints(Map<Integer, Long> predicted, Map<Integer, Long> official) {

        int points = 0;

        for (int pos = 1; pos <= 10; pos++) {

            Long predictedDriver = predicted.get(pos);
            Long correctDriver = official.get(pos);

            if (predictedDriver == null || correctDriver == null) continue;

            // Treffer in richtiger Position
            if (Objects.equals(predictedDriver, correctDriver)) {
                if (pos <= 3) points += 5;      // Podium korrekt
                else points += 3;             // Top 10 korrekt
                continue;
            }

            // Fahrer ist im Top 10, aber falscher Platz
            boolean isInTop10 = official.values().contains(predictedDriver);

            if (isInTop10) {
                if (pos <= 3) points += 2;    // Podium: Fahrer dort, aber falsche Position
                else points += 1;             // Top 10: Fahrer dort, aber falsche Position
            }
        }

        return points;
    }

    /**
     * Berechnet die Gesamtpunkte für einen einzelnen User.
     * @param user Der User, für den die Punkte berechnet werden sollen
     * @return Die Gesamtpunkte des Users
     */
    public int calculateUserPoints(AppUser user) {
        List<Race> races = raceRepository.findAll();
        int totalPoints = 0;

        for (Race race : races) {
            // Nur geschlossene Rennen zählen
            if (!"CLOSED".equalsIgnoreCase(race.getStatus().name())) continue;

            // Tipps des Users für dieses Rennen
            List<Tip> userTips = tipRepository.findByUserIdAndRaceId(user.getId(), race.getId());
            if (userTips.isEmpty()) continue;

            // Offizielle Ergebnisse
            List<OfficialResult> results = officialResultRepository.findByRaceId(race.getId());
            if (results.isEmpty()) continue;

            // Map: finalPosition → driverId
            Map<Integer, Long> officialPosMap = new HashMap<>();
            for (OfficialResult r : results) {
                officialPosMap.put(r.getFinalPosition(), r.getDriver().getId());
            }

            // Map: predictedPosition → driverId
            Map<Integer, Long> predictedPosMap = new HashMap<>();
            for (Tip t : userTips) {
                predictedPosMap.put(t.getPredictedPosition(), t.getDriver().getId());
            }

            totalPoints += calculateRacePoints(predictedPosMap, officialPosMap);
        }

        return totalPoints;
    }
}