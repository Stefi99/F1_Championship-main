package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.dto.TipRequestDTO;
import com.wiss.f1.championship.dto.TipResponseDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.service.AppUserService;
import com.wiss.f1.championship.service.RaceService;
import com.wiss.f1.championship.service.TipService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tips")
public class TipController {

    private final TipService tipService;
    private final AppUserService userService;
    private final RaceService raceService;

    public TipController(TipService tipService, AppUserService userService, RaceService raceService) {
        this.tipService = tipService;
        this.userService = userService;
        this.raceService = raceService;
    }

    /**
     * Gibt den Tipp des aktuell eingeloggten Users für ein bestimmtes Rennen zurück.
     * 
     * @param raceId Die ID des Rennens
     * @return TipResponseDTO mit raceId und order (Array von Fahrernamen)
     */
    @GetMapping("/race/{raceId}")
    public ResponseEntity<TipResponseDTO> getTipForRace(@PathVariable Long raceId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser)) {
            return ResponseEntity.status(401).build();
        }

        AppUser currentUser = (AppUser) authentication.getPrincipal();
        
        Optional<Race> raceOpt = raceService.getRaceById(raceId);
        if (raceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Race race = raceOpt.get();
        List<String> order = tipService.getTipOrderForUserAndRace(currentUser, race);
        LocalDateTime updatedAt = tipService.getTipUpdatedAtForUserAndRace(currentUser, race);

        TipResponseDTO response = new TipResponseDTO(raceId, order, updatedAt);
        return ResponseEntity.ok(response);
    }

    /**
     * Speichert oder aktualisiert einen Tipp für den aktuell eingeloggten User.
     * 
     * @param request TipRequestDTO mit raceId und order (Array von Fahrernamen)
     * @return TipResponseDTO mit dem gespeicherten Tipp
     */
    @PostMapping
    public ResponseEntity<TipResponseDTO> createOrUpdateTip(@RequestBody TipRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser)) {
            return ResponseEntity.status(401).build();
        }

        AppUser currentUser = (AppUser) authentication.getPrincipal();

        // Validiere Request
        if (request.getRaceId() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (request.getOrder() == null || request.getOrder().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Rennen prüfen
        Optional<Race> raceOpt = raceService.getRaceById(request.getRaceId());
        if (raceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Race race = raceOpt.get();

        // Tipp speichern/aktualisieren
        try {
            tipService.saveOrUpdateTip(currentUser, race, request.getOrder());
            
            // Aktualisierten Tipp zurückgeben
            List<String> order = tipService.getTipOrderForUserAndRace(currentUser, race);
            LocalDateTime updatedAt = tipService.getTipUpdatedAtForUserAndRace(currentUser, race);
            TipResponseDTO response = new TipResponseDTO(request.getRaceId(), order, updatedAt);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Aktualisiert einen Tipp (Alias für POST).
     * 
     * @param request TipRequestDTO mit raceId und order
     * @return TipResponseDTO mit dem aktualisierten Tipp
     */
    @PutMapping
    public ResponseEntity<TipResponseDTO> updateTip(@RequestBody TipRequestDTO request) {
        return createOrUpdateTip(request);
    }

    /**
     * Gibt alle Tipps eines Users zurück.
     * 
     * @param userId Die ID des Users
     * @return Liste von TipResponseDTOs, gruppiert nach Rennen
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TipResponseDTO>> getAllTipsForUser(@PathVariable Long userId) {
        Optional<AppUser> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AppUser user = userOpt.get();
        List<TipResponseDTO> tips = tipService.getAllTipsForUser(user);
        return ResponseEntity.ok(tips);
    }
}
