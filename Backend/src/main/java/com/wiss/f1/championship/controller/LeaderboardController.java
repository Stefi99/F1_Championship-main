package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.dto.LeaderboardDTO;
import com.wiss.f1.championship.service.LeaderboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    // Service, der die Berechnung und Sortierung der Leaderboard-Daten übernimmt
    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    /**
     * Liefert die aktuelle Rangliste aller Spieler mit Punkten.
     * Rückgabe ist eine Liste von LeaderboardDTOs:
     * [{username, displayName, points, rank}, ...]
     */
    @GetMapping
    public List<LeaderboardDTO> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }
}


/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (LeaderboardController.java)
   ------------------------------------------------------------
   - Stellt Endpunkt für das Leaderboard bereit:
       * GET /api/leaderboard → Liste aller Spieler nach Punkten sortiert
   - Nutzt LeaderboardService, um Punkte zu berechnen und Ranglisten zu erstellen.
   - Rückgabe erfolgt in DTOs (LeaderboardDTO).
   ============================================================ */
