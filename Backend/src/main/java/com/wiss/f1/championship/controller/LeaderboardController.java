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

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardDTO> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }
}
