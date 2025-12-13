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
        // Holt einen User anhand seiner ID (nur Admins haben Zugriff)
        return userService.getUserById(id);
    }

    /**
     * Gibt das Profil des aktuell eingeloggten Users zurück.
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser() {
        // Holt die aktuelle Authentication aus dem SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Prüfung, ob ein gültiger User eingeloggt ist
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser)) {
            return ResponseEntity.status(401).build();
        }

        // Aktuellen User aus dem SecurityContext laden
        AppUser currentUser = (AppUser) authentication.getPrincipal();

        // Punkte für den User über das Leaderboard berechnen
        int points = leaderboardService.calculateUserPoints(currentUser);

        // Profil-Daten in DTO umwandeln
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
     */
    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateCurrentUser(@RequestBody UpdateProfileDTO updateProfileDTO) {
        // Holt die aktuelle Authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Prüft, ob ein gültiger Benutzer eingeloggt ist
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser)) {
            return ResponseEntity.status(401).build();
        }

        // Benutzer aus SecurityContext holen
        AppUser currentUser = (AppUser) authentication.getPrincipal();

        // User aus der DB neu abrufen (falls Änderungen erfolgt sind)
        AppUser user = userService.getUserById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Profil aktualisieren und speichern
        user = userService.updateUserProfile(
                user,
                updateProfileDTO.getDisplayName(),
                updateProfileDTO.getFavoriteTeam(),
                updateProfileDTO.getCountry(),
                updateProfileDTO.getBio()
        );

        // Punkte neu berechnen
        int points = leaderboardService.calculateUserPoints(user);

        // Aktualisiertes Profil als DTO zurückgeben
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

/* ------------------------------------------------------------------------------------------
   ZUSAMMENFASSUNG
   ------------------------------------------------------------------------------------------
   Der AppUserController bietet Endpunkte für Benutzerprofile.
   Funktionen:
   - User nach ID abrufen (für Admins)
   - Eigene Profildaten abrufen (/me)
   - Eigenes Profil aktualisieren (/me, PUT)

   Eingeloggte Benutzer werden aus dem SecurityContext ausgelesen.
   Zusätzlich werden die User-Punkte über den LeaderboardService berechnet und im Profil angezeigt.
------------------------------------------------------------------------------------------- */
