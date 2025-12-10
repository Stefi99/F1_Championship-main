package com.wiss.f1.championship.controller;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wiss.f1.championship.dto.UpdateProfileDTO;
import com.wiss.f1.championship.dto.UserProfileDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.service.AppUserService;
import com.wiss.f1.championship.service.LeaderboardService;

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

    /**
     * Aktualisiert das Profil des aktuell eingeloggten Users.
     * @param updateProfileDTO DTO mit den zu aktualisierenden Profilfeldern
     * @return Aktualisiertes UserProfileDTO
     */
    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateCurrentUser(@RequestBody UpdateProfileDTO updateProfileDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser)) {
            return ResponseEntity.status(401).build();
        }

        AppUser currentUser = (AppUser) authentication.getPrincipal();
        
        // User aus der Datenbank laden (für frische Daten)
        AppUser user = userService.getUserById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Profil aktualisieren
        user = userService.updateUserProfile(
            user,
            updateProfileDTO.getDisplayName(),
            updateProfileDTO.getFavoriteTeam(),
            updateProfileDTO.getCountry(),
            updateProfileDTO.getBio()
        );
        
        // Punkte für den User berechnen
        int points = leaderboardService.calculateUserPoints(user);
        
        // Aktualisiertes UserProfileDTO erstellen
        UserProfileDTO profile = new UserProfileDTO(
            user.getUsername(),
            user.getDisplayName(),
            user.getEmail(),
            user.getFavoriteTeam(),
            user.getCountry(),
            user.getBio(),
            points,
            user.getRole().name()
        );
        
        return ResponseEntity.ok(profile);
    }

}
