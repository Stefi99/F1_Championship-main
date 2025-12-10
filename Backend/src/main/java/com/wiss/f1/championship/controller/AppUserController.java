package com.wiss.f1.championship.controller;
import com.wiss.f1.championship.dto.UserProfileDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.service.AppUserService;
import com.wiss.f1.championship.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService userService;
    private final LeaderboardService leaderboardService;

    public AppUserController(AppUserService userService, LeaderboardService leaderboardService) {
        this.userService = userService;
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/{id}")
    public Optional<AppUser> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    /**
     * Gibt das Profil des aktuell eingeloggten Users zurück.
     * @return UserProfileDTO mit allen Profilinformationen inklusive Punkte
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser)) {
            return ResponseEntity.status(401).build();
        }

        AppUser currentUser = (AppUser) authentication.getPrincipal();
        
        // Punkte für den User berechnen
        int points = leaderboardService.calculateUserPoints(currentUser);
        
        // UserProfileDTO erstellen
        UserProfileDTO profile = new UserProfileDTO(
            currentUser.getUsername(),
            currentUser.getDisplayName(),
            currentUser.getEmail(),
            currentUser.getFavoriteTeam(),
            currentUser.getCountry(),
            currentUser.getBio(),
            points,
            currentUser.getRole().name()
        );
        
        return ResponseEntity.ok(profile);
    }

}
